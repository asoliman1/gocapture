import { FormElement } from './../../model/form-element';
import { BaseElement } from './../form-view/elements/base-element';
import { Colors } from '../../constants/colors';
import { Component, Input, ViewChild, Renderer2, OnChanges, AfterViewInit, forwardRef, AfterViewChecked, DoCheck } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'section-block',
  templateUrl: 'section-block.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SectionBlock), multi: true }
  ]
})
export class SectionBlock extends BaseElement implements OnChanges, AfterViewInit, AfterViewChecked, DoCheck {
  private active: boolean = true;
  private selectedThemeColor: string;
  private contentHeight: number;
  private visibleElementsCount: number;
  private shouldResetSectionHeight: boolean = false;

  @Input('element') element: FormElement;
  @ViewChild("content") content: any;

  constructor(
    public renderer: Renderer2,
    public themeProvider: ThemeProvider
  ) {
    super();

    this.themeProvider.getActiveTheme().subscribe((theme) => {
      this.selectedThemeColor = Colors[theme.split('-')[0]];
      if (!this.selectedThemeColor) {
        this.selectedThemeColor = Colors['default'];
      }
    })
  }
  
  ngOnChanges() {
    if (this.element.collapse_content) {
      this.toggleSection();
    }
  }

  ngAfterViewInit() {
    this.updateSectionHeight();
    this.visibleElementsCount = this.getNumberOfVisibleElements();
  }

  ngAfterViewChecked() {
    if (this.shouldResetSectionHeight) {
      this.updateSectionHeight();
    }
  }

  ngDoCheck() {
    const currentVisibleElements = this.getNumberOfVisibleElements();
    this.shouldResetSectionHeight = currentVisibleElements !== this.visibleElementsCount;
  }

  toggleSection() {
    this.active = !this.active;
    this.updateSectionHeight();
  }

  private updateSectionHeight() {
    if (this.content.nativeElement && this.content.nativeElement.scrollHeight) {
      const defaultPadding = 5;
      this.contentHeight = this.content.nativeElement.scrollHeight + defaultPadding;

      const contentHeight = this.contentHeight ? this.contentHeight + 'px' : 'initial';
      const maxHeighValue = this.active ? contentHeight : "0px";
      this.renderer.setStyle(this.content.nativeElement, "max-height", maxHeighValue);
    }
  }

  private getNumberOfVisibleElements() {
    let count = 0;

    this.element.children.forEach((child: FormElement) => {
      if (child.isMatchingRules) {
        count++;
      }
    });
  
    return count;
  }
}

import { FormElement } from './../../model/form-element';
import { BaseElement } from './../form-view/elements/base-element';
import { Colors } from '../../constants/colors';
import { Component, Input, ViewChild, Renderer2, OnChanges, forwardRef } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'section-block',
  templateUrl: 'section-block.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SectionBlock), multi: true }
  ]
})
export class SectionBlock extends BaseElement implements OnChanges {
  active: boolean = true;
  selectedThemeColor: string;
  
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


  toggleSection() {
    this.active = !this.active;
    this.updateSectionHeight();
  }

  private updateSectionHeight() {
    if (this.content.nativeElement) {
      const maxHeighValue = this.active ? 'block' : "none";
      this.renderer.setStyle(this.content.nativeElement, "display", maxHeighValue);
    }
  }

}

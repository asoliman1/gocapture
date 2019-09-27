import { Colors } from '../../constants/colors';
import { Component, Input, ViewChild, Renderer2, OnChanges, AfterViewInit } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'section-block',
  templateUrl: 'section-block.html',
})
export class SectionBlock implements OnChanges, AfterViewInit {
  private active: boolean = true;
  private selectedThemeColor: string;
  private contentHeight: number;

  @Input('title') title: string;
  @Input('collapseContent') collapseContent?: boolean;

  @ViewChild("content") content: any;

  constructor(
    public renderer: Renderer2,
    public themeProvider: ThemeProvider
  ) {
    this.themeProvider.getActiveTheme().subscribe((theme) => {
      this.selectedThemeColor = Colors[theme.split('-')[0]];
      if (!this.selectedThemeColor) {
        this.selectedThemeColor = Colors['default'];
      }
    })
  }
  
  ngOnChanges() {
    if (this.collapseContent) {
      this.toggleSection();
    }
  }

  ngAfterViewInit() {
    if (this.content.nativeElement && this.content.nativeElement.scrollHeight) {
      const defaultPadding = 5;
      this.contentHeight = this.content.nativeElement.scrollHeight + defaultPadding;
    }
  }

  toggleSection() {
    this.active = !this.active;

    const contentHeight = this.contentHeight ? this.contentHeight + 'px' : 'initial';
    const maxHeighValue = this.active ? contentHeight : "0px";
    this.renderer.setStyle(this.content.nativeElement, "max-height", maxHeighValue);
  }
}

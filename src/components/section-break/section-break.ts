import { Colors } from './../../constants/colors';
import { Component, Input, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'section-break',
  templateUrl: 'section-break.html',
})
export class SectionBreak implements OnInit {
  private active: boolean = true;
  private arrowIcon: string = 'arrow-up';
  private selectedThemeColor: string;

  @Input('title') title: string;
  @ViewChild("content") content: any;

  constructor(
    public renderer: Renderer2,
    public themeProvider: ThemeProvider
  ) {
    this.themeProvider.getActiveTheme().subscribe((theme) => {
      this.selectedThemeColor = Colors[theme.split('-')[0]];
    })
  }
  
  ngOnInit() {
    this.initCSSTransition();
  }

  initCSSTransition() {
    this.renderer.setStyle(this.content.nativeElement, "webkitTransition", "max-height 500ms");
  }

  showSection() {
    this.renderer.setStyle(this.content.nativeElement, "max-height", "9999px");
  }

  hideSection() {
    this.renderer.setStyle(this.content.nativeElement, "max-height", "0px");
  }

  toggleAccordion() {
    this.active = !this.active;
    this.arrowIcon = this.arrowIcon == "arrow-up" ? "arrow-down" : "arrow-up";
    this.active ? this.showSection() : this.hideSection();
  }
}

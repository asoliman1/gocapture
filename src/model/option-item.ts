export class OptionItem {
  id?: string;
  title?: string;
  subtitle?: string;
  value?: any;
  search?: string;
  isSelected?: boolean = false;

  constructor(options: {id?: string, title?: string, subtitle?: string, search?: string, value?: any}) {
    this.id = options.id;
    this.title = options.title;
    this.subtitle = options.subtitle;
    this.search = options.search;
    this.value = options.value;
  }
}

export class OptionItem {
  id: string;
  title: string;
  subtitle: string;
  value: any;
  isSelected: boolean = false;

  constructor(id: string, title: string, subtitle: string, value: any) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.value = value;
  }
}

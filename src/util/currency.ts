import { Directive, HostListener, ElementRef, OnInit, LOCALE_ID, Inject } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

@Directive({ selector: "[myCurrency]" })
export class MyCurrencyDirective implements OnInit {

	private el: any;
	private currencyPipe: CurrencyPipe;

	constructor(
		private elementRef: ElementRef,
		@Inject(LOCALE_ID) private _locale: string
	) {
		this.el = this.elementRef.nativeElement;
		this.currencyPipe = new CurrencyPipe(this._locale);
	}

	ngOnInit() {
		this.el.value = this.currencyPipe.transform(this.el.value);
	}

	@HostListener("focus", ["$event.target.value"])
	onFocus(value) {
		let result = value.replace(/[^\d.]/g, '').replace(".00", "");
		this.el.children[0].value = result;
	}

	@HostListener("blur", ["$event.target.value"])
	onBlur(value) {
		this.el.children[0].value = value ? this.currencyPipe.transform(value).replace("USD", "$") : "";
	}
}
import { OrderResult } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class OrderSuccess extends Component<OrderResult> {
	protected event: IEvents;
	protected button: HTMLButtonElement;
	protected description: HTMLElement;
	constructor(container: HTMLElement, event: IEvents) {
		super(container);
		this.description = ensureElement(
			'.order-success__description',
			this.container
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.event = event;
		this.button.addEventListener('click', () => {
			this.event.emit('success:close');
		});
	}

	setDescription(description: string) {
		this.setText(this.description, description);
	}
}
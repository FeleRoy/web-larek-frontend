import { IProduct, TProductBasket } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Card } from "./Card";


export class Basket extends Component<TProductBasket> {
	protected event: IEvents;
	protected basketList: HTMLElement;
	protected basketPrice: HTMLElement;
	protected basketButton: HTMLElement;
	protected cardBasketTemplate: HTMLTemplateElement;
	protected basketCounter: number;
	constructor(container: HTMLElement, event: IEvents) {
		super(container);
		this.event = event;
		this.basketList = ensureElement('.basket__list', this.container);
		this.basketPrice = ensureElement('.basket__price', this.container);
		this.basketButton = ensureElement('.basket__button', this.container);
		this.cardBasketTemplate = document.querySelector('#card-basket');
		this.basketButton.addEventListener('click', () => {
			this.event.emit('basket:order');
		});
		this.basketCounter = 1;
	}

	addProducts(data: IProduct[]) {
		this.basketList.innerHTML = '';
		this.basketCounter = 1;
		data.forEach((product) => {
			const card = new Card(cloneTemplate(this.cardBasketTemplate), this.event);
			card.setData(product);
			card.setBasketIndex(this.basketCounter);
			this.basketList.append(card.render());
			this.basketCounter++;
		});
	}

	removeProduct(productId: string) {
		this.basketList.querySelector(`[data-id="${productId}"]`).remove();
		this.basketCounter = 1;
		Array.from(this.basketList.querySelectorAll('.basket__item')).forEach(
			(item) => {
				const index: HTMLElement = item.querySelector('.basket__item-index');
				this.setText(index, `${this.basketCounter}`);
				this.basketCounter++;
			}
		);
	}

	setPrice(totalPrice: number) {
		this.setText(this.basketPrice, `${totalPrice} синапсов`);
	}

	toggleButton() {
		if (this.basketCounter === 1) {
			this.setDisabled(this.basketButton, true);
		} else {
			this.setDisabled(this.basketButton, false);
		}
	}
}
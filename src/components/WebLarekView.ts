import {
	IProduct,
	TProductCard,
	IPage,
	TProductBasket,
	OrderResult,
} from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Page extends Component<IPage> {
	protected basketCounterElement: HTMLElement;
	protected basket: HTMLElement;
	protected gallery: HTMLElement;
	protected cardCatalogTemplate: HTMLTemplateElement;
	protected wrapper: HTMLElement;
	protected event: IEvents;

	constructor(container: HTMLElement, event: IEvents) {
		super(container);
		this.event = event;
		this.basket = ensureElement('.header__basket', this.container);
		this.basketCounterElement = ensureElement(
			'.header__basket-counter',
			this.container
		);
		this.gallery = ensureElement('.gallery', this.container);
		this.cardCatalogTemplate = ensureElement(
			'#card-catalog',
			this.container
		) as HTMLTemplateElement;
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.basket.addEventListener('click', () => {
			this.event.emit('basket:open');
		});
	}

	set catalog(products: IProduct[]) {
		products.forEach((product) => {
			const card = new Card(
				cloneTemplate(this.cardCatalogTemplate),
				this.event
			);
			card.setData(product);
			this.gallery.append(card.render());
		});
	}

	set basketCounter(newBasketCounter: string) {
		this.setText(this.basketCounterElement, newBasketCounter);
	}

	set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
export class Card extends Component<IProduct> {
	protected cardCategory?: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardText?: HTMLElement;
	protected cardId: string;
	protected cardBasketIndex?: HTMLElement;
	protected cardButton?: HTMLButtonElement;
	protected cardDeleteButton?: HTMLButtonElement;
	protected event: IEvents;

	constructor(container: HTMLElement, event: IEvents) {
		super(container);
		this.cardCategory = container.querySelector('.card__category');
		this.cardTitle = ensureElement('.card__title', this.container);
		this.cardImage = container.querySelector('.card__image');
		this.cardPrice = ensureElement('.card__price', this.container);
		this.cardText = container.querySelector('.card__text');
		this.cardBasketIndex = container.querySelector('.basket__item-index');
		this.cardButton = container.querySelector('.basket__item-add');
		this.cardDeleteButton = container.querySelector('.basket__item-delete');
		this.event = event;
		if (container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => {
				this.event.emit<{ id: string }>('product:select', { id: this.cardId });
			});
		}

		if (this.cardButton) {
			this.cardButton.addEventListener('click', () => {
				this.event.emit<{ id: string }>('product:tobasket', {
					id: this.cardId,
				});
				this.disableButton();
			});
		}
		if (this.cardDeleteButton) {
			this.cardDeleteButton.addEventListener('click', () => {
				this.event.emit<{ id: string }>('basket:deleteproduct', {
					id: this.cardId,
				});
			});
		}
	}

	setData(productData: IProduct) {
		this.setText(this.cardCategory, productData.category);
		this.setText(this.cardTitle, productData.title);
		this.setImage(this.cardImage, productData.image);
		if (productData.price) {
			this.setText(this.cardPrice, `${productData.price} синапсов`);
		} else {
			this.setText(this.cardPrice, `бесконечно синапсов`);
			this.disableButton();
		}
		this.setText(this.cardText, productData.description);
		this.cardId = productData.id;
		this.container.dataset.id = this.cardId;
		if (this.cardCategory) {
			switch (productData.category) {
				case 'софт-скил':
					this.cardCategory.classList.add('card__category_soft');
					break;
				case 'другое':
					this.cardCategory.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this.cardCategory.classList.add('card__category_additional');
					break;
				case 'кнопка':
					this.cardCategory.classList.add('card__category_button');
					break;
				case 'хард-скил':
					this.cardCategory.classList.add('card__category_hard');
					break;
			}
		}
	}

	setBasketIndex(index: number) {
		this.setText(this.cardBasketIndex, index);
	}

	getId() {
		return this.cardId;
	}

	disableButton() {
		this.setDisabled(this.cardButton, true);
	}
}
export class Modal<T> extends Component<T> {
	protected event: IEvents;
	protected modalContainer: HTMLElement;
	protected buttonClose: HTMLElement;

	constructor(selector: string, event: IEvents) {
		super(document.querySelector(selector));
		this.event = event;
		this.buttonClose = ensureElement('.modal__close', this.container);
		this.modalContainer = ensureElement('.modal__content', this.container);
		this.buttonClose.addEventListener('click', () => {
			this.close();
		});
	}

	protected closeByEsc = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};
	protected closeByOverlay = (evt: PointerEvent) => {
		if (evt.currentTarget === evt.target) {
			this.close();
		}
	};

	open(content: HTMLElement) {
		this.modalContainer.append(content);
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this.closeByEsc);
		this.container.addEventListener('click', this.closeByOverlay);
		this.event.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.modalContainer.innerHTML = '';
		document.removeEventListener('keydown', this.closeByEsc);
		this.container.removeEventListener('click', this.closeByOverlay);
		this.event.emit('modal:close');
	}
}
export class Form<T> extends Component<HTMLFormElement> {
	protected event: IEvents;
	protected submitButton: HTMLButtonElement;
	protected errorElement: HTMLElement;
	protected form: HTMLFormElement;
	protected buttonCard?: HTMLButtonElement;
	protected buttonCash?: HTMLButtonElement;
	protected inputAddress?: HTMLInputElement;
	protected inputEmail?: HTMLInputElement;
	protected inputPhone?: HTMLInputElement;
	constructor(container: HTMLFormElement, event: IEvents) {
		super(container);
		this.event = event;
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.errorElement = ensureElement('.form__errors', this.container);
		this.form = this.container as HTMLFormElement;

		this.buttonCard = this.container.querySelector('button[name=card]');
		this.buttonCash = this.container.querySelector('button[name=cash]');
		this.inputAddress = this.container.querySelector('input[name=address]');
		this.inputEmail = this.container.querySelector('input[name=email]');
		this.inputPhone = this.container.querySelector('input[name=phone]');

		if (this.buttonCash) {
			this.buttonCash.addEventListener('click', () => {
				this.toggleAltButton('cash');
				event.emit('order:cash', { value: this.inputAddress.value });
			});
		}
		if (this.buttonCard) {
			this.buttonCard.addEventListener('click', () => {
				this.toggleAltButton('card');
				event.emit('order:card', { value: this.inputAddress.value });
			});
		}

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.event.emit(`${this.container.dataset.name}:submit`);
		});

		this.event.on(
			'form:step1-validation',
			(data: { errors: Record<string, string | null>; isValid: boolean }) => {
				this.showValidationErrors(data.errors);
				this.toggleSubmitButton(data.isValid);
			}
		);

		this.event.on(
			'form:step2-validation',
			(data: { errors: Record<string, string | null>; isValid: boolean }) => {
				this.showValidationErrors(data.errors);
				this.toggleSubmitButton(data.isValid);
			}
		);

		if (this.inputAddress) {
			this.inputAddress.addEventListener('input', () => {
				this.event.emit(`address:input`, { value: this.inputAddress.value });
			});
		}
		if (this.inputEmail) {
			this.inputEmail.addEventListener('input', () => {
				this.event.emit(`contacts:input`, {
					email: this.inputEmail.value,
					phone: this.inputPhone.value,
				});
			});
			this.inputPhone.addEventListener('input', () => {
				this.event.emit(`contacts:input`, {
					email: this.inputEmail.value,
					phone: this.inputPhone.value,
				});
			});
		}
	}

	setContactsListeners(inputElement: HTMLInputElement) {
		if (inputElement) {
			inputElement.addEventListener('input', () => {
				this.event.emit(`contacts:input`, {
					email: this.inputEmail.value,
					phone: this.inputPhone.value,
				});
			});
		}
	}

	showValidationErrors(errors: Record<string, string | null>) {
		const firstError = Object.values(errors).find((error) => error !== null);
		this.errorElement.textContent = firstError || '';
	}

	toggleSubmitButton(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}

	toggleAltButton(value: string) {
		if (value === 'card') {
			this.buttonCard.classList.add('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');
		} else {
			this.buttonCard.classList.remove('button_alt-active');
			this.buttonCash.classList.add('button_alt-active');
		}
	}

	getAddressValue() {
		return this.inputAddress.value;
	}

	getContactsValue() {
		return { phone: this.inputPhone.value, email: this.inputEmail.value };
	}

	clear() {
		this.form.reset();
		this.submitButton.disabled = true;
	}
}

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

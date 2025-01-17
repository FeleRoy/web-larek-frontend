import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


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
		this.setText(this.errorElement, firstError || '');
	}

	toggleSubmitButton(isValid: boolean) {
		this.setDisabled(this.submitButton, !isValid);
	}

	toggleAltButton(value: string) {
		if (value === 'card') {
			this.toggleClass(this.buttonCard, 'button_alt-active', true);
			this.toggleClass(this.buttonCash, 'button_alt-active', false);
			
		} else {
			this.toggleClass(this.buttonCard, 'button_alt-active', false);
			this.toggleClass(this.buttonCash, 'button_alt-active', true);
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
		this.setDisabled(this.submitButton, true);
	}
}
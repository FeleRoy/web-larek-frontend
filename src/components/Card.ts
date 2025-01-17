import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


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
    protected _categoryColor = <Record<string, string>> { // описания категории
        "софт-скил": "soft",
        "другое": "other",
        "дополнительное": "additional",
        "кнопка": "button",
        "хард-скил": "hard"
      }

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
            this.toggleClass(this.cardCategory, `card__category_${this._categoryColor[productData.category]}`, true)
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
import { IPage, IProduct } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { Card } from "./Card";



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
            this.toggleClass(this.wrapper, 'page__wrapper_locked', true);
        } else {
            this.toggleClass(this.wrapper, 'page__wrapper_locked', false);
        }
    }
}
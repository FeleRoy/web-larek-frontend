import { IProduct, TProductCard, IPage } from "../types";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Page extends Component<IPage> {
    protected basketCounter: HTMLElement;
    protected basket: HTMLElement;
    protected gallery: HTMLElement;
    protected cardCatalogTemplate: HTMLTemplateElement;
    protected event: IEvents;

    constructor(container: HTMLElement, event: IEvents) {
        super(container);
        this.event = event;
        this.basket = ensureElement('.header__basket', this.container)
        this.basketCounter = ensureElement('.header__basket-counter', this.container);
        this.gallery = ensureElement('.gallery', this.container);
        this.cardCatalogTemplate = ensureElement('#card-catalog', this.container) as HTMLTemplateElement;
    }

    set Catalog(Products: IProduct[]){
        Products.forEach((product)=>{
            const card = new Card(cloneTemplate(this.cardCatalogTemplate), this.event);
            card.setData(product);
            this.gallery.append(card.render());
        })
    }

    set BasketCounter(newBasketCounter: string){
        this.setText(this.basketCounter, newBasketCounter);
    }

}
export class Card extends Component<IProduct> {
    protected cardCategory: HTMLElement;
    protected cardTitle: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardPrice: HTMLElement;
    protected cardId: string;
    protected event: IEvents;

    constructor(container: HTMLElement, event: IEvents) {
        super(container);
        this.cardCategory = ensureElement('.card__category', this.container);
        this.cardTitle = ensureElement('.card__title', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardPrice = ensureElement('.card__price', this.container);
        this.event = event;
        this.container.addEventListener('click',()=>{
            this.event.emit('product:select');
        });

    }

    setData(productData: IProduct) {
        this.setText(this.cardCategory, productData.category);
        this.setText(this.cardTitle, productData.title);
        this.setImage(this.cardImage, productData.image);
        this.setText(this.cardPrice, `${productData.price} синапсов`);
        this.cardId = productData.id;
    }

    

    getId() {
        return this.cardId;
    }
}
// class Modal extends Component {
    
// }
// class Form extends Component {
    
// }
// class Basket extends Component {
    
// }
// class OrderSuccessModal extends Component {
    
// }
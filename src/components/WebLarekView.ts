import { IProduct, TProductCard, IPage } from "../types";
import { cloneTemplate, ensureElement,  } from "../utils/utils";
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

    set Catalog(products: IProduct[]){
        products.forEach((product)=>{
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
export class Modal<T> extends Component<T> {
    protected event: IEvents;
    protected modalContainer: HTMLElement;
    protected buttonClose: HTMLElement;

    constructor(selector: string, event: IEvents){
        super(document.querySelector(selector));
        this.event = event;
        this.buttonClose = ensureElement('.modal__close', this.container);
        this.modalContainer = ensureElement('.modal__content', this.container);
    }

    protected closeByEsc = (evt: KeyboardEvent)=>{
        if(evt.key === "Escape"){
            this.close();
        }
    };
    protected closeByOverlay = (evt: PointerEvent)=>{
        if (evt.currentTarget === evt.target) {
            this.close();
        }
    };

    open(content: HTMLElement){
        this.modalContainer.append(content);
        this.container.classList.add('modal_active');
        this.buttonClose.addEventListener('click', ()=>{
            this.close();
        });
        document.addEventListener('keydown', this.closeByEsc);
        this.container.addEventListener('click', this.closeByOverlay);
    }

    close(){
        this.container.classList.remove('modal_active');
        this.modalContainer.innerHTML = '';
        document.removeEventListener('keydown', this.closeByEsc);
        this.container.removeEventListener('click', this.closeByOverlay);
    }

}
export class Form extends Component<HTMLElement> {
    protected event: IEvents;
    constructor(selector: string, event: IEvents){
        super(document.querySelector(selector));
        this.event = event;
    }
}
// class Basket extends Component {
    
// }
// class OrderSuccessModal extends Component {
    
// }
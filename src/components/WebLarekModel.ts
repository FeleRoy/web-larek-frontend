import { Contacts, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsData {
    protected products: IProduct[] = [];
    protected select: string | null;
    events: IEvents;
    constructor(events: IEvents){
        this.events = events;
    }

    addProduct(product: IProduct) {
        this.products.push(product)
    }
    getProduct(productId: string) {
        this.products.forEach((item) => {
            if (item.id === productId) {
                return item;
            }
        })
    }
}

export class ContactsData {
    payment: string;
    email: string;
    phone: string;
    address: string;

    checkValidation(data: Record<keyof Contacts, string>) {
        
    }
}

export class BasketModal {
    items: IProduct[] = [];
    total: number;

    addProduct(product: IProduct) {
        this.items.push(product);
    }
    removeProduct(product: IProduct) {
        this.items = this.items.filter((item) =>{ item.id !== product.id})
    }

}
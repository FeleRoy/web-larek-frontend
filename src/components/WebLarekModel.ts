import { Contacts, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsData {
    protected products: IProduct[] = [];
    protected events: IEvents;
    constructor(events: IEvents){
        this.events = events;
    }

    addProduct(product: IProduct) {
        this.products.push(product)
    }
    addProducts(products: IProduct[]){
        products.forEach((product)=>{
            this.addProduct(product);
        })
    }

    getProduct(productId: string) {
        return this.products.find(item => item.id === productId)
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
    total: number = 0;
    events: IEvents;
    constructor(events: IEvents){
        this.events = events;
    }

    addProduct(product: IProduct) {
        this.items.push(product);
        this.total = this.calculateTotal();
        this.events.emit('basket:additem');
    }
    removeProduct(productId: string) {
        this.items = this.items.filter((item) => item.id !== productId);
        this.total = this.calculateTotal();
        this.events.emit<{id: string}>('basket:removeitem', {id: productId});
    }
    calculateTotal(){
        return this.items.reduce((acc, current)=>{
             return acc + current.price
        }, 0);
    }
    containProduct(id: string){
        return this.items.some((item)=> item.id === id);
    }
}

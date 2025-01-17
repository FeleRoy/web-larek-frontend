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
    payment: string = "";
    email: string = "";
    phone: string = "";
    address: string = "";
    formErrors: Contacts;
    protected events: IEvents;
    constructor(events: IEvents){
        this.events = events;
    }
      
    validateEmail = (email: string): string | null => {
        if (email === "") return "Поле email обязательно";
        return null;
    }  
      
    validatePhone = (phone: string): string | null => {
        if (phone === "") return "Введите свой номер телефона";
        return null;
    }
        
    validateAddress = (address: string): string | null => {
            if (address === "") return "Введите адрес";
            return null;
    }

    validatePayment = (payment: string): string | null => {
            if (payment === "") return "Выберете способ оплаты";
            return null;
    }
    
    validateStep1(data: { address: string}) {
        const errors = {
          payment: this.validatePayment(this.payment), 
          address: this.validateAddress(data.address),
        }
    
        const isValid = Object.values(errors).every((error) => error === null);
    
        this.events.emit("form:step1-validation", { errors, isValid });
    }
    validateStep2(data: { phone: string; email: string }) {
        const errors = {
          phone: this.validatePhone(data.phone),
          email: this.validateEmail(data.email),
        }
    
        const isValid = Object.values(errors).every((error) => error === null);
    
        this.events.emit("form:step2-validation", { errors, isValid });
    }
      
}

export class BasketModal {
    items: IProduct[] = [];
    total: number = 0;
    protected IdArray:string[] = [];
    protected events: IEvents;
    constructor(events: IEvents){
        this.events = events;
    }

    addProduct(product: IProduct) {
        this.items.push(product);
        this.total = this.calculateTotal();
        this.events.emit('basket:change');
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

    getIdBasketItems(){
        this.items.forEach((item)=>{
            this.IdArray.push(item.id);
        }) 
        return this.IdArray;
    }

    clearBasket(){
        this.items = [];
        this.events.emit('basket:change');
    }
}

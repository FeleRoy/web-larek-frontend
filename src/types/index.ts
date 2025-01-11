export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface Contacts {
    payment: string;
    email: string;
    phone: string;
    address: string;

}

export interface IPage {
    BasketCounter: string;
    Catalog: IProduct[];
}

export type TProductCard = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

export type TProductDescription = Pick<IProduct, 'category' | 'title' | 'image' | 'price' | 'description'>;

export type TProductBasket = {
    index: number;
    title: string;
    price: number;
}


//--------------------------API-----------------------------
export type APIListResponse<Type> = {
    total: number;
    items: Type[];
}

export interface Order extends Contacts{
    total: number;
    items: string[];
}

export interface OrderResult {
    id: string;
    total: number;
}

export interface IProductAPI {
    getProducts: () => Promise<APIListResponse<IProduct>>;
    orderProducts: (order: Order) => Promise<OrderResult>;
}

//--------------------------API-----------------------------

//--------------------------Model-----------------------------

export interface IProductsData {
    products: IProduct[];
    select: string | null;
    addProduct(product: IProduct): void;
    getProduct(productId: string): IProduct;
}

export interface IBasketModal {
    items: IProduct[];
    total: number;
    addProduct(product: IProduct): void;
    removeProduct(product: IProduct): void;
}


//--------------------------Model-----------------------------\

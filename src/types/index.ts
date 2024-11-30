interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface Contacts {
    payment: string;
    email: string;
    phone: string;
    address: string;

}

type TProductCard = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

type TProductDescription = Pick<IProduct, 'category' | 'title' | 'image' | 'price' | 'description'>;

type TProductBasket = {
    index: number;
    title: string;
    price: number;
}


//--------------------------API-----------------------------
type APIListResponse<Type> = {
    total: number;
    items: Type[];
}

interface Order extends Contacts{
    total: number;
    items: string[];
}

interface OrderResult {
    id: string;
    total: number;
}

interface IProductAPI {
    getProducts: () => Promise<APIListResponse<IProduct>>;
    orderProducts: (order: Order) => Promise<OrderResult>;
}

//--------------------------API-----------------------------

//--------------------------Model-----------------------------

interface IProductsData {
    products: IProduct[];
    select: string | null;
    addProduct(product: IProduct): void;
    getProduct(productId: string): IProduct;
}

interface IBasketModal {
    items: IProduct[];
    total: number;
    addProduct(product: IProduct): void;
    removeProduct(product: IProduct): void;
}


//--------------------------Model-----------------------------\

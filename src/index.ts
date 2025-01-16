import { AppApi } from './components/AppApi';
import {API_URL, CDN_URL} from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { BasketModal, ProductsData} from './components/WebLarekModel';
import {Basket, Card, Modal, Page} from './components/WebLarekView';
import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { IProduct } from './types';

const eventsEmitter = new EventEmitter();
const productsModal = new ProductsData(eventsEmitter);
const basketModal = new BasketModal(eventsEmitter);


const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const gallery = document.querySelector('.gallery');

const page = new Page(document.querySelector('.page'), eventsEmitter);
const modal = new Modal('.modal', eventsEmitter);
const basketView = new Basket(cloneTemplate(basketTemplate), eventsEmitter);

//modal.open(card2.render());

const api = new AppApi(CDN_URL, API_URL);
// const card1 = new Card(cloneTemplate(cardCatalogTemplate), EventsEmit);
// card1.setData({
//     id: '1',
//     description: 'Описание',
//     image: 'https://sun9-63.userapi.com/impg/RxggABMm6CPpZ6wEHSJzlypej9sGYFANtvxEPg/wYyRzdBSR2s.jpg?size=1620x2160&quality=95&sign=61c577682174b17284c4dc70e0439945&type=album',
//     title: 'Заголовок',
//     category: 'Роскошь',
//     price: 25
// });
// gallery.append(card1.render());

// const card2 = new Card(cloneTemplate(cardCatalogTemplate), EventsEmit);
// card2.setData({
//     id: '1',
//     description: 'Описание',
//     image: 'https://sun9-63.userapi.com/impg/RxggABMm6CPpZ6wEHSJzlypej9sGYFANtvxEPg/wYyRzdBSR2s.jpg?size=1620x2160&quality=95&sign=61c577682174b17284c4dc70e0439945&type=album',
//     title: 'Заголовок',
//     category: 'Роскошь',
//     price: 25
// });

// EventsEmit.on('product:select', ()=>{
//     console.log('product:select');
// })



// page.render({
//     BasketCounter: '2'
// })
// const catalog1 = [{
//     id: '1',
//     description: 'Описание',
//     image: 'https://fond-vsem-mirom.ru/wp-content/uploads/2020/06/gk_zdhbg784-1024x682.jpg',
//     title: 'Заголовок',
//     category: 'Роскошь',
//     price: 25
// }, {
//     id: '2',
//     description: 'Описание',
//     image: 'https://fond-vsem-mirom.ru/wp-content/uploads/2020/06/gk_zdhbg784-1024x682.jpg',
//     title: 'Заголовок',
//     category: 'Роскошь',
//     price: 25
// }]
// page.render({
//     Catalog: catalog1
// })


// api.getProductItem("854cef69-976d-4c2a-a18c-2aa45046c390").then((data)=> {
//     console.log(data);
// });

// api.orderProducts({
//     "payment": "online",
//     "email": "test@test.ru",
//     "phone": "+71234567890",
//     "address": "Spb Vosstania 1",
//     "total": 2200,
//     "items": [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//     ]
// }).then((data)=>{
//     console.log(data);
// })

api.getProductList().then((data)=> {
    productsModal.addProducts(data);
    page.render({Catalog: data});
    console.log(data);
});

eventsEmitter.on<{id: string}>('product:select', (data)=>{
    api.getProductItem(`${data.id}`).then((data)=> {
        const card = new Card(cloneTemplate(cardPreviewTemplate), eventsEmitter);
        card.setData(data);
        if(basketModal.containProduct(data.id)){
            card.disableButton();
        }
        modal.open(card.render());
    });
});
eventsEmitter.on<{id: string}>('product:tobasket', (data)=>{
    api.getProductItem(`${data.id}`).then((data)=> {
        basketModal.addProduct(data);
    });
    
});
eventsEmitter.on('basket:additem', ()=>{
    page.BasketCounter = `${basketModal.items.length}`;
});

eventsEmitter.on('basket:open', ()=>{
    basketView.addProducts(basketModal.items);
    basketView.setPrice(basketModal.total);
    basketView.toggleButton();
    modal.open(basketView.render());
});


eventsEmitter.on<{id: string}>('basket:deleteproduct', (data)=>{
    basketModal.removeProduct(data.id);
});

eventsEmitter.on<{id: string}>('basket:removeitem', (data)=>{
    basketView.removeProduct(data.id);
    basketView.setPrice(basketModal.total);
    basketView.toggleButton();
    page.BasketCounter = `${basketModal.items.length}`;
});

// Блокируем прокрутку страницы если открыта модалка
eventsEmitter.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
eventsEmitter.on('modal:close', () => {
    page.locked = false;
});
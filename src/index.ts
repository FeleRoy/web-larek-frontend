import { AppApi } from './components/AppApi';
import {API_URL, CDN_URL} from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { BasketModal, ProductsData} from './components/WebLarekModel';
import {Card, Modal, Page} from './components/WebLarekView';
import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { IProduct } from './types';

const EventsEmit = new EventEmitter();
const Products = new ProductsData(EventsEmit);
const Basket = new BasketModal();

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const gallery = document.querySelector('.gallery');

const card1 = new Card(cloneTemplate(cardCatalogTemplate), EventsEmit);
card1.setData({
    id: '1',
    description: 'Описание',
    image: 'https://fond-vsem-mirom.ru/wp-content/uploads/2020/06/gk_zdhbg784-1024x682.jpg',
    title: 'Заголовок',
    category: 'Роскошь',
    price: 25
});
gallery.append(card1.render());

const card2 = new Card(cloneTemplate(cardCatalogTemplate), EventsEmit);
card2.setData({
    id: '1',
    description: 'Описание',
    image: 'https://fond-vsem-mirom.ru/wp-content/uploads/2020/06/gk_zdhbg784-1024x682.jpg',
    title: 'Заголовок',
    category: 'Роскошь',
    price: 25
});

// EventsEmit.on('product:select', ()=>{
//     console.log('product:select');
// })

const page = new Page(document.querySelector('.page'), EventsEmit);

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
//     id: '1',
//     description: 'Описание',
//     image: 'https://fond-vsem-mirom.ru/wp-content/uploads/2020/06/gk_zdhbg784-1024x682.jpg',
//     title: 'Заголовок',
//     category: 'Роскошь',
//     price: 25
// }]
// page.render({
//     Catalog: catalog1
// })


const modal = new Modal('.modal', EventsEmit);

modal.open(card2.render());

const api = new AppApi(CDN_URL, API_URL);

// api.getProductList().then((data)=> {
//     console.log(data);
//     page.render({Catalog: data});
// });

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
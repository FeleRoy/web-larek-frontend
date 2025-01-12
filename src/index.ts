import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModal, ProductsData} from './components/WebLarekModel';
import {Card, Modal, Page} from './components/WebLarekView';
import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';

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
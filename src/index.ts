import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	BasketModal,
	ContactsData,
	ProductsData,
} from './components/WebLarekModel';
import {
	Basket,
	Card,
	Form,
	Modal,
	OrderSuccess,
	Page,
} from './components/WebLarekView';
import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { Contacts, IProduct } from './types';

const eventsEmitter = new EventEmitter();
const productsModal = new ProductsData(eventsEmitter);
const basketModal = new BasketModal(eventsEmitter);
const contactsModal = new ContactsData(eventsEmitter);

const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector(
	'#order'
) as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const page = new Page(document.querySelector('.page'), eventsEmitter);
const modal = new Modal('.modal', eventsEmitter);
const basketView = new Basket(cloneTemplate(basketTemplate), eventsEmitter);
const orderForm = new Form(cloneTemplate(orderFormTemplate), eventsEmitter);
const contactsForm = new Form(
	cloneTemplate(contactsFormTemplate),
	eventsEmitter
);
const successOrder = new OrderSuccess(
	cloneTemplate(successTemplate),
	eventsEmitter
);

const api = new AppApi(CDN_URL, API_URL);

api.getProductList().then((data) => {
	productsModal.addProducts(data);
	page.render({ Catalog: data });
}).catch((err) => {
	console.log(`Ошибка : ${err}`);
});

eventsEmitter.on<{ id: string }>('product:select', (data) => {
	api.getProductItem(`${data.id}`).then((data) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), eventsEmitter);
		card.setData(data);
		if (basketModal.containProduct(data.id)) {
			card.disableButton();
		}
		modal.open(card.render());
	}).catch((err) => {
		console.log(`Ошибка : ${err}`);
	});
});
eventsEmitter.on<{ id: string }>('product:tobasket', (data) => {
	api.getProductItem(`${data.id}`).then((data) => {
		basketModal.addProduct(data);
	}).catch((err) => {
		console.log(`Ошибка : ${err}`);
	});
});
eventsEmitter.on('basket:change', () => {
	page.BasketCounter = `${basketModal.items.length}`;
});

eventsEmitter.on('basket:open', () => {
	basketView.addProducts(basketModal.items);
	basketView.setPrice(basketModal.total);
	basketView.toggleButton();
	modal.open(basketView.render());
});

eventsEmitter.on<{ id: string }>('basket:deleteproduct', (data) => {
	basketModal.removeProduct(data.id);
});

eventsEmitter.on<{ id: string }>('basket:removeitem', (data) => {
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

eventsEmitter.on('basket:order', () => {
	modal.close();
	modal.open(orderForm.render());
});

eventsEmitter.on<{ value: string }>('order:card', (data) => {
	contactsModal.payment = 'card';
	contactsModal.validateStep1({ address: data.value });
});

eventsEmitter.on<{ value: string }>('order:cash', (data) => {
	contactsModal.payment = 'cash';
	contactsModal.validateStep1({ address: data.value });
});

eventsEmitter.on<{ value: string }>('address:input', (data) => {
	contactsModal.validateStep1({ address: data.value });
});

eventsEmitter.on('order:submit', () => {
	contactsModal.address = orderForm.getAddressValue();
	modal.close();
	modal.open(contactsForm.render());
});

eventsEmitter.on<{ phone: string; email: string }>('contacts:input', (data) => {
	contactsModal.validateStep2({ phone: data.phone, email: data.email });
});

eventsEmitter.on('contacts:submit', () => {
	const data = contactsForm.getContactsValue();
	contactsModal.phone = data.phone;
	contactsModal.email = data.email;
	api
		.orderProducts({
			payment: contactsModal.payment,
			email: contactsModal.email,
			phone: contactsModal.phone,
			address: contactsModal.address,
			total: basketModal.total,
			items: basketModal.getIdBasketItems(),
		})
		.then((data) => {
			successOrder.setDescription(`списано ${data.total} синапсов`);
			orderForm.clear();
			contactsForm.clear();
			basketModal.clearBasket();
			modal.close();
			modal.open(successOrder.render());
		})
		.catch((err) => {
			console.log(`Ошибка покупки: ${err}`);
		});
});

eventsEmitter.on('success:close', () => {
	modal.close();
});

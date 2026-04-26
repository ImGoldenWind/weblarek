import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { BuyerData } from './components/Models/BuyerData';
import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { OrderSuccess } from './components/View/OrderSuccess';
import { API_URL, CDN_URL, BUTTON_ADD_TO_BASKET, BUTTON_REMOVE_FROM_BASKET } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { IProduct, IBuyer, TPayment } from './types';

// ========== Брокер событий ==========

const events = new EventEmitter();

// ========== Модели данных ==========

const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new BuyerData(events);

// ========== Коммуникационный слой ==========

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ========== Представления ==========

const page = new Page(document.body, events);
const modal = new Modal(
    document.getElementById('modal-container') as HTMLElement,
    events
);

// Переиспользуемые экземпляры представлений
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const orderSuccess = new OrderSuccess(cloneTemplate<HTMLElement>('#success'), events);

// ========== Состояние презентера ==========

type FormStep = 'order' | 'contacts' | null;
let currentStep: FormStep = null;
let currentPreviewCard: CardPreview | null = null;

// ========== Вспомогательная функция рендера карточек корзины ==========

function renderBasketItems(): HTMLElement[] {
    return basket.getItems().map((product, index) => {
        const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
            onDelete: () => events.emit('basket:removeItem', { id: product.id }),
        });
        card.index = index + 1;
        return card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            image: '',
            category: '',
            description: '',
        });
    });
}

// ========== Обработчики событий Моделей ==========

// Каталог изменился → отрисовать карточки на главной странице
events.on('catalog:changed', () => {
    const cards = catalog.getItems().map(product => {
        const card = new CardCatalog(
            cloneTemplate<HTMLElement>('#card-catalog'),
            { onClick: () => events.emit('card:select', product) }
        );
        return card.render({ ...product, image: CDN_URL + product.image });
    });
    page.render({ catalog: cards, counter: basket.getCount() });
});

// Превью изменилось → открыть модальное окно с карточкой товара
events.on('preview:changed', () => {
    const product = catalog.getPreview();
    if (!product) return;

    currentPreviewCard = new CardPreview(
        cloneTemplate<HTMLElement>('#card-preview'),
        { onClick: () => events.emit('card:toBasket', product) }
    );
    currentPreviewCard.buttonText = basket.hasItem(product.id)
        ? BUTTON_REMOVE_FROM_BASKET
        : BUTTON_ADD_TO_BASKET;
    currentPreviewCard.buttonDisabled = product.price === null;

    modal.render({
        content: currentPreviewCard.render({
            ...product,
            image: CDN_URL + product.image,
        }),
    });
});

// Корзина изменилась → обновить счётчик, перерисовать корзину и кнопку в превью
events.on('basket:changed', () => {
    page.render({ counter: basket.getCount() });
    basketView.render({ items: renderBasketItems(), total: basket.getTotalPrice() });

    const preview = catalog.getPreview();
    if (preview && currentPreviewCard) {
        currentPreviewCard.buttonText = basket.hasItem(preview.id)
            ? 'Убрать из корзины'
            : 'В корзину';
    }
});

// Данные покупателя изменились → обновить активную форму
events.on('buyer:changed', () => {
    const errors = buyer.validate();
    const data = buyer.getData();

    if (currentStep === 'order') {
        orderForm.render({
            valid: !errors.payment && !errors.address,
            payment: data.payment,
            address: data.address,
            errors: [errors.payment, errors.address].filter(Boolean).join('. '),
        });
    } else if (currentStep === 'contacts') {
        contactsForm.render({
            valid: !errors.phone && !errors.email,
            email: data.email,
            phone: data.phone,
            errors: [errors.phone, errors.email].filter(Boolean).join('. '),
        });
    }
});

// ========== Обработчики событий Представлений ==========

// Выбор карточки в каталоге → установить превью
events.on('card:select', (product: IProduct) => {
    catalog.setPreview(product);
});

// Кнопка «В корзину» / «Убрать из корзины» → добавить или убрать товар
events.on('card:toBasket', (product: IProduct) => {
    if (basket.hasItem(product.id)) {
        basket.removeItem(product);
    } else {
        basket.addItem(product);
    }
});

// Удалить товар из корзины по id
events.on('basket:removeItem', ({ id }: { id: string }) => {
    const product = catalog.getItem(id);
    if (product) basket.removeItem(product);
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basketView.render({
            items: renderBasketItems(),
            total: basket.getTotalPrice(),
        }),
    });
});

// Начать оформление заказа → показать форму выбора оплаты и адреса
events.on('order:start', () => {
    currentStep = 'order';
    const errors = buyer.validate();
    const data = buyer.getData();
    modal.render({
        content: orderForm.render({
            valid: false,
            payment: data.payment,
            address: data.address,
            errors: [errors.payment, errors.address].filter(Boolean).join('. '),
        }),
    });
});

// Изменение способа оплаты
events.on('order:paymentChange', ({ payment }: { payment: TPayment }) => {
    buyer.setField({ payment });
});

// Ввод в форме заказа (адрес)
events.on('order:input', ({ field, value }: { field: string; value: string }) => {
    buyer.setField({ [field]: value } as Partial<IBuyer>);
});

// Отправка формы заказа → перейти к форме контактов
events.on('order:submit', () => {
    currentStep = 'contacts';
    const errors = buyer.validate();
    const data = buyer.getData();
    modal.render({
        content: contactsForm.render({
            valid: !errors.phone && !errors.email,
            email: data.email,
            phone: data.phone,
            errors: [errors.phone, errors.email].filter(Boolean).join('. '),
        }),
    });
});

// Ввод в форме контактов (email, телефон)
events.on('contacts:input', ({ field, value }: { field: string; value: string }) => {
    buyer.setField({ [field]: value } as Partial<IBuyer>);
});

// Отправка формы контактов → создать заказ на сервере
events.on('contacts:submit', () => {
    const data = buyer.getData();
    webLarekApi
        .createOrder({
            ...data,
            payment: data.payment as TPayment,
            total: basket.getTotalPrice(),
            items: basket.getItems().map(item => item.id),
        })
        .then(result => {
            currentStep = null;
            basket.clear();
            buyer.clear();
            modal.render({ content: orderSuccess.render({ total: result.total }) });
        })
        .catch(console.error);
});

// Закрыть экран успешного заказа
events.on('success:close', () => {
    modal.close();
});

// Модальное окно закрыто → сбросить состояние презентера
events.on('modal:close', () => {
    currentStep = null;
    currentPreviewCard = null;
});

// ========== Загрузка данных с сервера ==========

webLarekApi
    .getProducts()
    .then(data => {
        catalog.setItems(data.items);
    })
    .catch(console.error);

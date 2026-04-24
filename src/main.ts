import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { BuyerData } from './components/Models/BuyerData';
import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// --- ProductCatalog ---
const catalog = new ProductCatalog();

catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());

const firstItem = apiProducts.items[0];
console.log('Получение товара по id:', catalog.getItem(firstItem.id));
console.log('Поиск несуществующего id:', catalog.getItem('nonexistent-id'));

catalog.setPreview(firstItem);
console.log('Товар для подробного отображения:', catalog.getPreview());

// --- Basket ---
const basket = new Basket();

console.log('Корзина пуста, количество товаров:', basket.getCount());

const item1 = apiProducts.items[0];
const item2 = apiProducts.items[1];

basket.addItem(item1);
basket.addItem(item2);
console.log('Корзина после добавления двух товаров:', basket.getItems());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Итоговая стоимость:', basket.getTotalPrice());

console.log('Наличие item1 в корзине:', basket.hasItem(item1.id));
console.log('Наличие item с несуществующим id:', basket.hasItem('nonexistent-id'));

basket.removeItem(item1);
console.log('Корзина после удаления item1:', basket.getItems());

basket.clear();
console.log('Корзина после очистки:', basket.getItems());

// --- BuyerData ---
const buyer = new BuyerData();

console.log('Ошибки валидации (все поля пусты):', buyer.validate());

buyer.setField('payment', 'online');
buyer.setField('address', 'ул. Пушкина, д. 1');
console.log('Ошибки после заполнения payment и address:', buyer.validate());

buyer.setField('phone', '+79001234567');
buyer.setField('email', 'test@example.com');
console.log('Ошибки после заполнения всех полей:', buyer.validate());

console.log('Данные покупателя:', buyer.getData());

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

// --- WebLarekApi: загрузка каталога с сервера ---
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
    .then((data) => {
        catalog.setItems(data.items);
        console.log('Каталог товаров, полученный с сервера:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при загрузке товаров:', err);
    });

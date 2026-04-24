import { IApi, IOrderRequest, IOrderResponse, IProductList } from '../types';

const PRODUCTS_ENDPOINT = '/product/';
const ORDER_ENDPOINT = '/order/';

export class WebLarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProducts(): Promise<IProductList> {
        return this._api.get<IProductList>(PRODUCTS_ENDPOINT);
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this._api.post<IOrderResponse>(ORDER_ENDPOINT, order);
    }
}

import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    protected _items: IProduct[] = [];
    protected _preview: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this._preview = item;
        this.events.emit('preview:changed');
    }

    getPreview(): IProduct | null {
        return this._preview;
    }
}

import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    protected _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit('basket:changed');
    }

    removeItem(item: IProduct): void {
        this._items = this._items.filter(i => i.id !== item.id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}

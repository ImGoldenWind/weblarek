import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CURRENCY_LABEL } from '../../utils/constants';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _totalPrice: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = container.querySelector('.basket__list')!;
        this._totalPrice = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;

        this._button.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(cards: HTMLElement[]) {
        this._list.replaceChildren(...cards);
        this._button.disabled = cards.length === 0;
    }

    set total(value: number) {
        this._totalPrice.textContent = `${value} ${CURRENCY_LABEL}`;
    }
}

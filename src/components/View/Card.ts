import { Component } from '../base/Component';
import { IProduct, ICardActions } from '../../types';
import { CURRENCY_LABEL, PRICELESS_LABEL } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value !== null ? `${value} ${CURRENCY_LABEL}` : PRICELESS_LABEL;
    }
}

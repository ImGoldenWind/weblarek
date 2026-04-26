import { Card } from './Card';
import { ICardBasketActions } from '../../types';

export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        this._index = container.querySelector('.basket__item-index')!;
        this._deleteButton = container.querySelector('.basket__item-delete')!;

        if (actions?.onDelete) {
            this._deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}

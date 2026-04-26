import { Card } from './Card';
import { ICardActions } from '../../types';

export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._description = container.querySelector('.card__text')!;
        this._button = container.querySelector('.card__button')!;

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}

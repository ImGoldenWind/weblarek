import { Component } from '../base/Component';
import { IProduct, ICardActions } from '../../types';
import { categoryMap, CURRENCY_LABEL, PRICELESS_LABEL } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = container.querySelector('.card__title')!;
        this._price = container.querySelector('.card__price')!;
        this._image = container.querySelector<HTMLImageElement>('.card__image');
        this._category = container.querySelector('.card__category');

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

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value);
        }
    }

    set category(value: string) {
        if (this._category) {
            const el = this._category;
            el.textContent = value;
            Object.values(categoryMap).forEach(cls => el.classList.remove(cls));
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                el.classList.add(modifier);
            }
        }
    }
}

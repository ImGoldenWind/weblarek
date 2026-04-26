import { Card } from './Card';
import { ICardActions } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement('.card__category', container);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        const el = this._category;
        el.textContent = value;
        Object.values(categoryMap).forEach(cls => el.classList.remove(cls));
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            el.classList.add(modifier);
        }
    }
}

import { Card } from './Card';
import { ICardActions } from '../../types';

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
    }
}

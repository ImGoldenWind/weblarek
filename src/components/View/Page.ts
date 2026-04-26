import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPage {
    catalog: HTMLElement[];
    counter: number;
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _basketButton: HTMLElement;
    protected _basketCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._gallery = container.querySelector('.gallery')!;
        this._basketButton = container.querySelector('.header__basket')!;
        this._basketCounter = container.querySelector('.header__basket-counter')!;

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set counter(value: number) {
        this._basketCounter.textContent = String(value);
    }
}

import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected _basketButton: HTMLElement;
    protected _basketCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._basketButton = container.querySelector('.header__basket')!;
        this._basketCounter = container.querySelector('.header__basket-counter')!;

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._basketCounter.textContent = String(value);
    }
}

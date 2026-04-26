import { Form } from './Form';
import { IFormState } from '../../types';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderFormState extends IFormState {
    payment: TPayment | '';
    address: string;
}

export class OrderForm extends Form<IOrderFormState> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = Array.from(
            container.querySelectorAll<HTMLButtonElement>('.order__buttons .button')
        );
        this._addressInput = container.querySelector<HTMLInputElement>('[name=address]')!;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:paymentChange', { payment: button.name as TPayment });
            });
        });
    }

    set payment(value: TPayment | '') {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}

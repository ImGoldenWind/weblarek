import { Form } from './Form';
import { IFormState } from '../../types';
import { IEvents } from '../base/Events';

interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = container.querySelector<HTMLInputElement>('[name=email]')!;
        this._phoneInput = container.querySelector<HTMLInputElement>('[name=phone]')!;
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}

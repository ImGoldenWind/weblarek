import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerData {
    protected _payment: TPayment | '' = '';
    protected _address: string = '';
    protected _phone: string = '';
    protected _email: string = '';

    constructor(protected events: IEvents) {}

    setField(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this._payment = data.payment;
        }
        if (data.email !== undefined) {
            this._email = data.email;
        }
        if (data.phone !== undefined) {
            this._phone = data.phone;
        }
        if (data.address !== undefined) {
            this._address = data.address;
        }
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            phone: this._phone,
            email: this._email,
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._phone = '';
        this._email = '';
        this.events.emit('buyer:changed');
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._payment) errors.payment = 'Не выбран вид оплаты';
        if (!this._address) errors.address = 'Укажите адрес доставки';
        if (!this._phone) errors.phone = 'Укажите номер телефона';
        if (!this._email) errors.email = 'Укажите емэйл';

        return errors;
    }
}

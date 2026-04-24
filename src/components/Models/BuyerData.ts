import { IBuyer, TPayment } from '../../types';

export class BuyerData {
    protected _payment: TPayment | '' = '';
    protected _address: string = '';
    protected _phone: string = '';
    protected _email: string = '';

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this._payment = value as TPayment;
        } else if (field === 'address') {
            this._address = value;
        } else if (field === 'phone') {
            this._phone = value;
        } else if (field === 'email') {
            this._email = value;
        }
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
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

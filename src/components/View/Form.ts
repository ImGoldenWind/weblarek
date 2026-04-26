import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IFormState } from '../../types';

export class Form<T extends IFormState> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = container.querySelector('[type=submit]')!;
        this._errorContainer = container.querySelector('.form__errors')!;

        const formName = container.name;

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.events.emit(`${formName}:input`, {
                field: target.name,
                value: target.value,
            });
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${formName}:submit`);
        });
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errorContainer.textContent = value;
    }
}

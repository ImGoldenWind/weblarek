import { Component } from '../base/Component';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._content = container.querySelector('.modal__content')!;
        this._closeButton = container.querySelector('.modal__close')!;

        this._closeButton.addEventListener('click', () => this.close());

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
    }

    render(data: { content: HTMLElement }): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}

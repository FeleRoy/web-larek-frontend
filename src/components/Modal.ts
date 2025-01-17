import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class Modal<T> extends Component<T> {
    protected event: IEvents;
    protected modalContainer: HTMLElement;
    protected buttonClose: HTMLElement;

    constructor(selector: string, event: IEvents) {
        super(document.querySelector(selector));
        this.event = event;
        this.buttonClose = ensureElement('.modal__close', this.container);
        this.modalContainer = ensureElement('.modal__content', this.container);
        this.buttonClose.addEventListener('click', () => {
            this.close();
        });
    }

    protected closeByEsc = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };
    protected closeByOverlay = (evt: PointerEvent) => {
        if (evt.currentTarget === evt.target) {
            this.close();
        }
    };

    open(content: HTMLElement) {
        this.modalContainer.append(content);
        this.toggleClass(this.container, 'modal_active', true);
        document.addEventListener('keydown', this.closeByEsc);
        this.container.addEventListener('click', this.closeByOverlay);
        this.event.emit('modal:open');
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.modalContainer.innerHTML = '';
        document.removeEventListener('keydown', this.closeByEsc);
        this.container.removeEventListener('click', this.closeByOverlay);
        this.event.emit('modal:close');
    }
}
import { MessageInterface } from './message';

type Listener = (newMessage: MessageInterface) => void;

export class MessagesService {
	static instance: MessagesService;
	messages: MessageInterface[] = [];
	listeners: Array<Listener> = [];

	constructor() {
		if (MessagesService.instance) {
			return MessagesService.instance
		}
		MessagesService.instance = this;

		this.load();
	}

	add(message: MessageInterface) {
		this.messages.push(message);
		this.listeners.forEach(listener => listener(message));
		this.save();
	}

	subscribe(listener: Listener) {
		this.listeners.push(listener);
	}

	save(): void {
		localStorage.setItem('messages', JSON.stringify(this.messages));
	}

	load() {
		try {
			this.messages = JSON.parse(localStorage.getItem('messages') || '');
		} catch (e) {
			this.messages = [];
		}
	}
}

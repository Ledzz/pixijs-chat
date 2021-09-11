import { Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { TextInput } from './text-input';
import { MessagesService } from './messages-service';
import { Width } from './constants';

const Svg = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 488.721 488.721" fill="white"><path d="M483.589 222.024a51.197 51.197 0 00-23.762-23.762L73.522 11.331C48.074-.998 17.451 9.638 5.122 35.086A51.2 51.2 0 003.669 76.44l67.174 167.902L3.669 412.261c-10.463 26.341 2.409 56.177 28.75 66.639a51.314 51.314 0 0018.712 3.624c7.754 0 15.408-1.75 22.391-5.12l386.304-186.982c25.45-12.326 36.089-42.949 23.763-68.398zM58.657 446.633c-8.484 4.107-18.691.559-22.798-7.925a17.065 17.065 0 01-.481-13.784l65.399-163.516h340.668L58.657 446.633zm42.121-219.358L35.379 63.759a16.64 16.64 0 014.215-18.773 16.537 16.537 0 0119.063-2.884l382.788 185.173H100.778z"/></svg>`);


export class MessageSend extends Container {
	input = new TextInput({ placeholder: 'Введите сообщение' });
	button = this.makeButton();
	messagesService = new MessagesService();
	constructor() {
		super();

		this.input.x = 0;
		this.input.y = 18;

		this.addChild(this.input);
		this.addChild(this.button);

	}

	makeButton() {
		const button = new Container();
		const sprite =  Sprite.from(Svg);
		button.addChild(sprite);
		button.interactive = true;
		button.buttonMode = true;

		button.x = Width - 26;

		button.on('click', this.send.bind(this))

		return button;
	}

	reset() {
		this.input.setValue('');
	}

	send() {
		if (this.input.value === '') {
			return;
		}
		this.messagesService.add({
			fromMe: true,
			sendDate: (new Date()).toISOString(),
			text: this.input.value
		})
		this.reset();
	}
}

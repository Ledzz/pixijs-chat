import { Application, Graphics } from 'pixi.js';
import { MessageSend } from './message-send';
import { MessageContainer } from './message-container';
import { Height, Width } from './constants';

class Chat {
	app: Application;

	constructor() {
		this.app = new Application({
			backgroundColor: 0x2d2b55,
			resizeTo: window
		});
		document.body.appendChild(this.app.view);

		const messageSend = new MessageSend();

		messageSend.x = window.innerWidth / 2 - Width / 2;
		messageSend.y = window.innerHeight / 2 + Height / 2 + 20;

		const messageContainer = new MessageContainer();

		messageContainer.x = window.innerWidth / 2 - Width / 2;
		messageContainer.y = window.innerHeight / 2 - Height / 2;


		const graphics = new Graphics();
		graphics.beginFill(0x28264b);
		graphics.drawRoundedRect(messageContainer.x, messageContainer.y, Width + 20, Height, 12);
		this.app.stage.addChild(graphics);

		this.app.stage.addChild(messageSend);
		this.app.stage.addChild(messageContainer);
	}
}

new Chat();


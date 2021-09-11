import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Width } from './constants';

export interface MessageInterface {
	fromMe: boolean;
	sendDate: string;
	text: string;
}

const Padding = 12;
const Margin = 8;

const Radius = 8;
const TriangleSize = 12;

const textStyle = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 18,
	fill: '#ffffff',
	wordWrap: true,
	wordWrapWidth: Width - Padding * 2,
	lineJoin: 'round',
});

export class Message extends Container {
	text = new Text('', textStyle);

	constructor(public message: MessageInterface) {
		super();
		this.text.text = message.text;
		this.text.x = this.message.fromMe ? (Width - this.text.width - Padding) : Padding + TriangleSize;
		this.text.y = Padding;
		this.drawBubble();
		this.addChild(this.text);
	}

	get height() {
		return this.text.height + Padding * 2 + Margin;
	}

	get bubbleWidth(): number {
		return this.text.width + Padding * 2;
	}

	get bubbleHeight(): number {
		return this.text.height + Padding * 2;
	}

	private drawBubble() {
		const graphics = new Graphics();

		graphics.beginFill(0x1d1b33);
		const x = this.message.fromMe ? Width - this.bubbleWidth : TriangleSize;
		graphics.drawRoundedRect(x, 0, this.bubbleWidth, this.bubbleHeight, Radius);

		if (this.message.fromMe) {
			graphics.moveTo(Width, this.bubbleHeight - TriangleSize);
			graphics.lineTo(Width + TriangleSize, this.bubbleHeight);
			graphics.lineTo(Width - Radius, this.bubbleHeight);
		} else {
			graphics.moveTo(TriangleSize, this.bubbleHeight - TriangleSize);
			graphics.lineTo(0, this.bubbleHeight);
			graphics.lineTo(Radius + TriangleSize, this.bubbleHeight);
		}

		graphics.endFill();
		this.addChild(graphics);
	}
}

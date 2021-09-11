import { Container, Graphics, InteractionData, InteractionEvent } from 'pixi.js';
import { Message } from './message';
import { MessagesService } from './messages-service';
import { tween } from './tween';
import { Height, Width } from './constants';

export class MessageContainer extends Container {
	instances: Array<Message> = [];
	messagesService = new MessagesService();
	viewport = new Container();
	wrapper = new Container();

	scrollHeight = 0;
	scrollTop = 0;

	scrollbar = new Container();
	scrollbarThumb = new Container();
	thumbGraphics = new Graphics();

	dragStartPoint?: number;
	startScrollTop?: number;

	constructor() {
		super();

		this.addChild(this.viewport);
		this.viewport.addChild(this.wrapper);

		this.renderMessages();
		this.createMask();
		this.createScrollbar();
		this.addScrollbarInteraction();
	}

	renderMessages() {
		this.instances = this.messagesService.messages.map(m => new Message(m));

		this.scrollHeight = 0;
		this.instances.forEach(m => {
			m.y = this.scrollHeight;
			this.scrollHeight += m.height;
			this.wrapper.addChild(m);
			this.scrollToBottom();
		});

		this.messagesService.subscribe((message) => {
			const instance = new Message(message);
			instance.y = this.scrollHeight;
			this.scrollHeight += instance.height;
			this.instances.push(instance);
			this.wrapper.addChild(instance);
			this.scrollToBottom();
		});
	}

	scrollToBottom() {
		tween((value) => {
			this.scrollTop = value;
			this.updateScroll();
		}, 160, -this.wrapper.y, this.scrollHeight - Height)
	}

	onDragStart = (e: InteractionEvent) => {
		this.dragStartPoint = e.data.getLocalPosition(this.scrollbar).y;
		this.startScrollTop = this.scrollTop;
	}

	onDragEnd = () => {
		this.dragStartPoint = undefined;
	}

	onDragMove = (e: InteractionEvent) => {
		if (this.dragStartPoint === undefined) {
			return;
		}

		const newPosition = e.data.getLocalPosition(this.scrollbar);
		const delta = newPosition.y - this.dragStartPoint!;
		this.setClampedScroll(this.startScrollTop! + delta * (Height / this.scrollbarHeight));
	}

	private createMask() {
		const mask = new Graphics();
		mask.beginFill(0xff0000);
		mask.drawRect(0, 0, window.innerWidth, Height);
		mask.endFill();
		this.viewport.addChild(mask);
		this.viewport.mask = mask;
	}

	private createScrollbar() {
		const graphics = new Graphics();
		graphics.beginFill(0x1c1b36);
		graphics.drawRect(Width + 20, 0, 5, Height);
		graphics.endFill();
		this.addChild(this.scrollbar);
		this.scrollbar.addChild(graphics);
		this.scrollbarThumb.addChild(this.thumbGraphics);
		this.scrollbar.addChild(this.scrollbarThumb);
	}

	private updateScroll() {
		this.wrapper.y = -this.scrollTop;
		const progress = this.scrollTop / (this.scrollHeight - Height);
		this.thumbGraphics.clear();
		this.thumbGraphics.beginFill(0x59deff);
		this.thumbGraphics.drawRect(
			Width + 20,
			progress * (Height - this.scrollbarHeight),
			5, this.scrollbarHeight);
		this.thumbGraphics.endFill();
	}

	get scrollbarHeight(): number {
		return Math.min(Height / this.scrollHeight, 1) * Height;
	}

	private setClampedScroll(value: number) {
		this.scrollTop = Math.min(this.scrollHeight - Height, Math.max(0, value));
		this.updateScroll();
	}

	private addScrollbarInteraction() {
		// TODO: scroll on click
		window.addEventListener('mousewheel', (e) => {
			this.setClampedScroll(this.scrollTop + (e as WheelEvent).deltaY);
		}); // TODO: hit test

		this.scrollbarThumb.interactive = true;
		this.scrollbarThumb
			.on('mousedown', this.onDragStart)
			.on('mouseup', this.onDragEnd)
			.on('mouseupoutside', this.onDragEnd)
			.on('mousemove', this.onDragMove)
	}
}

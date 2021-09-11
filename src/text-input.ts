import { Container, Rectangle, Renderer, Text, TextStyle } from 'pixi.js';
import { getTransformMatrix } from './get-transform-matrix';

const TextInputWidth = 450;

const textStyle = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 20,
	lineHeight: 30,
	fill: '#ffffff',
	wordWrap: true,
	wordWrapWidth: TextInputWidth,
	lineJoin: 'round',
});

const placeholderStyle = (() => {
	const style = textStyle.clone();
	style.fill = '#ffffff';
	return style;
})()

export class TextInput extends Container {
	textarea!: HTMLTextAreaElement;
	text = new Text('', textStyle);
	placeholder = new Text('', placeholderStyle);
	focused = false;
	hovered = false;

	cachedValues = '';
	renderer!: Renderer;

	constructor({placeholder = ''}: {placeholder: string}) {
		super();
		this.createDOM();
		this.addListeners();

		this.addChild(this.text);

		this.placeholder.text = placeholder;
		this.placeholder.alpha = 0.3;
		this.addChild(this.placeholder);
	}

	needsUpdate(): boolean {
		const newValues = JSON.stringify([this.x, this.y]);

		if (newValues !== this.cachedValues) {
			this.cachedValues = newValues;
			return true;
		}

		return false;
	}

	onInput = (e: Event) => {
		this.update();
	}
	onAdded = () => {
		document.body.appendChild(this.textarea);
	}
	onRemoved = () => {
		document.body.removeChild(this.textarea);
	}

	onFocus = () => {
		this.text.visible = false;
		this.focused = true;
		this.placeholder.alpha = 1;
		this.update();
	}

	onBlur = () => {
		this.text.visible = true;
		this.focused = false;
		this.placeholder.alpha = 0.3;
		this.update();
	}

	onMouseOver = () => {
		this.placeholder.alpha = this.focused ? 1 : 0.7;
	}

	onMouseOut = () => {
		this.placeholder.alpha = this.focused ? 1 : 0.3;
	}

	render(renderer: Renderer) {
		super.render(renderer);

		if (this.needsUpdate()) {
			this.renderer = renderer;
			this.update();
		}
	}

	update() {
		this.updateText();
		this.updateDOMInput();
		this.updatePlaceholder();
	}

	updateDOMInput() {
		this.textarea.style.cssText = `
			position: absolute;
			top: -3px;
			left: 0px;
			background: none;
			border: none;
			resize: none;
			padding: 0;
			margin: 0;
			font-family: ${textStyle.fontFamily};
			line-height: ${textStyle.lineHeight}px;
			font-size: ${textStyle.fontSize}px;
			color: ${textStyle.fill};
			height: ${this.text.height}px;
			overflow: hidden;
			opacity: ${this.focused ? 1 : 0};
			outline: none;
			transform: ${getTransformMatrix(this.renderer, this.worldTransform)};
			width: ${TextInputWidth}px;
		`;
	}

	updateText() {
		this.text.text = this.textarea.value;
	}

	private createDOM() {
		this.textarea = document.createElement('textarea');
		this.textarea.value = '';
		this.update();
	}

	private addListeners() {
		this.textarea.addEventListener('input', this.onInput);
		this.textarea.addEventListener('mouseover', this.onMouseOver);
		this.textarea.addEventListener('mouseout', this.onMouseOut);
		this.textarea.addEventListener('focus', this.onFocus);
		this.textarea.addEventListener('blur', this.onBlur);
		this.on('added', this.onAdded)
		this.on('removed', this.onRemoved)
	}

	private updatePlaceholder() {
		this.placeholder.visible = !this.textarea.value;
	}

	get value(): string {
		return this.textarea.value;
	}

	setValue(value: string) {
		this.textarea.value = '';
		this.update();
	}
}

import { Renderer , Matrix} from 'pixi.js';

export const getTransformMatrix = (renderer: Renderer, transform: Matrix): string => {
	if (!renderer) {
		return '';
	}
	const resolution = renderer.resolution;
	let canvas_bounds = renderer.view.getBoundingClientRect()
	let m = transform.clone()

	m.scale(resolution, resolution)
	m.scale(canvas_bounds.width / renderer.width,
		canvas_bounds.height / renderer.height)

	return 'matrix(' + [m.a, m.b, m.c, m.d, m.tx, m.ty].join(',') + ')'
}


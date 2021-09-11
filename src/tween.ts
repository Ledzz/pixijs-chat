const lerp = (from: number, to: number, value: number) => (to - from) * value + from;
const easing = (value: number) => {
	if ((value *= 2) < 1) {
		return 0.5 * value * value * value
	}
	return 0.5 * ((value -= 2) * value * value + 2)
}

export const tween = (callback: (value: number) => void, duration: number, from: number, to: number) => {
	let progress = 0;
	const startTime = performance.now();
	const animate = (time: DOMHighResTimeStamp) => {
		const delta = time - startTime;
		progress = delta / duration;
		const value = lerp(from, to, easing(progress));
		callback(value);
		if (progress < 1) {
			requestAnimationFrame(animate);
		} else {
			callback(to);
		}
	};

	animate(startTime);
}

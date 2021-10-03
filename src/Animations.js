export default class Animations {
	constructor() {
		this.animations = [];
	}

	addAnimation(animation) {
		this.animations.push(animation);
	}

	run() {
		requestAnimationFrame(this.run.bind(this));
		this.animations.forEach(animation => {});
	}

	runAnimations() {
		this.animations.forEach(animation => animation());
	}
}

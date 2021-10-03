import { KEY_CODES } from './constants';

export default class KeyListener {
	constructor() {
		this.keys = {};
		this.start();
	}

	includesKeyCode(keyCode) {
		return Object.values(KEY_CODES).includes(keyCode);
	}

	keyDown(e) {
		if (this.includesKeyCode(e.keyCode)) this.keys[e.keyCode] = true;
	}

	keyUp(e) {
		if (this.includesKeyCode(e.keyCode)) this.keys[e.keyCode] = false;
	}

	start() {
		window.addEventListener('keydown', this.keyDown.bind(this));
		window.addEventListener('keyup', this.keyUp.bind(this));
	}

	isKeyPressed(keyCode) {
		return !!this.keys[keyCode];
	}

	stop() {
		window.removeEventListener('keydown', this.keyDown.bind(this));
		window.removeEventListener('keyup', this.keyUp.bind(this));
	}
}

import * as THREE from 'three';
import { KEY_CODES } from './utils/constants';

export default class Skateboard {
	constructor(scene, camera, keyListener) {
		this.scene = scene;
		this.camera = camera;
		this.keyListener = keyListener;
		this.createSkateboard();
		this.skateboard;
	}

	createSkateboard() {
		const geo = new THREE.BoxGeometry(3, 1, 3);
		const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
		this.skateboard = new THREE.Mesh(geo, material);
		this.skateboard.position.set(0, 0, 0);
		this.scene.add(this.skateboard);
	}

	animation() {
		if (this.keyListener.isKeyPressed(KEY_CODES.A_KEYCODE)) {
			this.skateboard.rotation.y += 0.01;
		} else if (this.keyListener.isKeyPressed(KEY_CODES.D_KEYCODE)) {
			this.skateboard.rotation.y -= 0.01;
		}
	}
}

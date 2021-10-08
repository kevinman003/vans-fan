import * as THREE from 'three';
import { KEY_CODES, SKATEBOARD } from './utils/constants';

export default class Skateboard {
	constructor(scene, camera, keyListener) {
		this.scene = scene;
		this.camera = camera;
		this.keyListener = keyListener;
		this.skateboard = new THREE.Group();
		this.createSkateboard();
		this.createEnd(false);
		this.createEnd(true);
		this.createWheels();

		this.scene.add(this.skateboard);
		this.x = 0;
		this.z = 0;
	}

	createSkateboard() {
		this.geo = new THREE.BoxGeometry(
			SKATEBOARD.WIDTH,
			SKATEBOARD.HEIGHT,
			SKATEBOARD.LENGTH
		);
		const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
		let deck = new THREE.Mesh(this.geo, material);
		deck.position.set(0, 0, 0);
		this.skateboard.add(deck);
	}

	animation() {
		this.geo.center();

		if (this.keyListener.isKeyPressed(KEY_CODES.A_KEYCODE)) {
			if (this.isFacingLeft()) {
				this.turn(SKATEBOARD.ROTATION);
			}
			this.z -= 0.003;
			this.skateboard.translateZ(this.z);
		} else if (this.keyListener.isKeyPressed(KEY_CODES.D_KEYCODE)) {
			if (this.isFacingRight()) {
				this.turn(-SKATEBOARD.ROTATION);
			}
			this.z -= 0.003;
			this.skateboard.translateZ(this.z);
		} else if (this.keyListener.isKeyPressed(KEY_CODES.W_KEYCODE)) {
			if (
				this.skateboard.rotation.y < SKATEBOARD.UP ||
				this.skateboard.rotation.y > SKATEBOARD.UP + SKATEBOARD.ROTATION
			) {
				this.skateboard.rotation.y -= SKATEBOARD.ROTATION;
			}
		}
		console.log(this.skateboard.rotation.y);
	}

	turn(rotation) {
		this.skateboard.rotation.y += rotation;
		// 	Math.round(this.skateboard.rotation.y, 2) + rotation;
		// console.log('afdsa', this.skateboard.rotation.y);
		// this.skateboard.rotation.y = Math.round(this.skateboard.rotation.y, 2);
	}

	isFacingLeft() {
		return (
			this.skateboard.rotation.y < SKATEBOARD.LEFT ||
			this.skateboard.rotation.y > SKATEBOARD.LEFT + SKATEBOARD.ROTATION
		);
	}

	isFacingRight() {
		return (
			this.skateboard.rotation.y < SKATEBOARD.RIGHT ||
			this.skateboard.rotation.y > SKATEBOARD.RIGHT + SKATEBOARD.ROTATION
		);
	}
	createEnd(isTail) {
		const noseLength = SKATEBOARD.LENGTH / 4;
		const extrudePath = new THREE.CatmullRomCurve3([
			// new THREE.Vector3((-2 * SKATEBOARD.LENGTH) / 2, 0, 0),
			// new THREE.Vector3(-0.5 * SKATEBOARD.LENGTH, SKATEBOARD.HEIGHT, 0),
			new THREE.Vector3(0, 0, SKATEBOARD.LENGTH / 2),
			new THREE.Vector3(0, 0, SKATEBOARD.LENGTH / 2 + noseLength),
		]);

		const nose = new THREE.Shape();
		nose.moveTo(0, -SKATEBOARD.WIDTH / 2);
		// nose.moveTo(0, 0);
		nose.lineTo(0, SKATEBOARD.WIDTH / 2);
		nose.lineTo(SKATEBOARD.HEIGHT, SKATEBOARD.WIDTH / 2);
		nose.lineTo(SKATEBOARD.HEIGHT, -SKATEBOARD.WIDTH / 2);
		const extrudeSettings = {
			extrudePath,
		};
		const noseMaterial = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
		// const geo = new THREE.ExtrudeGeometry(nose, extrudeSettings);
		// const noseGeometry = new THREE.ShapeGeometry(nose);
		const noseGeometry = new THREE.ExtrudeGeometry(nose, extrudeSettings);
		noseGeometry.center();
		const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
		const noseAngle = Math.PI / 8;

		let yTranslate = (noseLength / 2) * Math.sin(noseAngle) - 0.005; // fine tuning
		// to align bottom corner of nose to skateboard
		let alignBottomCorner =
			SKATEBOARD.HEIGHT * Math.cos(Math.PI / 2 - noseAngle);
		let zTranslate =
			SKATEBOARD.LENGTH / 2 +
			(noseLength / 2) * Math.cos(noseAngle) -
			alignBottomCorner +
			0.02; // fine tuning
		if (isTail) {
			noseGeometry.rotateX(noseAngle);
			zTranslate *= -1;
		} else {
			noseGeometry.rotateX(-noseAngle);
		}

		noseMesh.translateY(yTranslate);
		noseMesh.translateZ(zTranslate);
		this.skateboard.add(noseMesh);
	}

	createWheels() {
		for (let i = 0; i < 2; i++) {
			let widthMult = i % 2 == 0 ? -1 : 1;
			for (let j = 0; j < 2; j++) {
				let lengthMult = j % 2 == 0 ? -1 : 1;
				this.createWheel(
					(SKATEBOARD.WIDTH / 3) * widthMult,
					(SKATEBOARD.LENGTH / 3) * lengthMult
				);
			}
		}
	}
	createWheel(x, z) {
		const wheelGeo = new THREE.BoxGeometry(
			SKATEBOARD.WHEELS,
			SKATEBOARD.WHEELS,
			SKATEBOARD.WHEELS
		);
		const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
		const wheel = new THREE.Mesh(wheelGeo, material);

		wheel.translateY(-(SKATEBOARD.HEIGHT / 2 + SKATEBOARD.WHEELS / 2));
		wheel.translateX(x);
		wheel.translateZ(z);
		this.skateboard.add(wheel);
	}
}

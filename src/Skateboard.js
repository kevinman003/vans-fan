import * as THREE from 'three';
import { KEY_CODES, CAMERA } from './utils/constants/constants';
import { SKATEBOARD } from './utils/constants/skateboard';
import { mod } from './utils/utils';

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
		this.skateboard.position.set(0, 0, 0);
		this.scene.add(this.skateboard);
		this.x = 0;
		this.z = 0;
		this.rotation = 0;
		this.rotationMult = 1;
		this.isOnTop({ x: 0, y: 0, z: 0 });
	}

	createSkateboard() {
		this.geo = new THREE.BoxGeometry(
			SKATEBOARD.WIDTH,
			SKATEBOARD.HEIGHT,
			SKATEBOARD.LENGTH
		);
		const material = new THREE.MeshLambertMaterial({ color: 0x1f86ed });
		let deck = new THREE.Mesh(this.geo, material);
		this.skateboard.add(deck);
	}

	animation() {
		this.geo.center();
		this.move();
	}

	turn(direction, opposite) {
		let rotationMult = this.isLessClockwise(
			this.skateboard.rotation.y,
			direction
		)
			? SKATEBOARD.CLOCKWISE
			: SKATEBOARD.C_CLOCKWISE;

		let rotationAng = this.rotation + SKATEBOARD.ROTATION;
		// if (rotation)
		this.rotation += SKATEBOARD.ROTATION * rotationMult;
		if (this.rotation < -Math.PI) this.rotation += 2 * Math.PI;
		else if (this.rotation > Math.PI * 2) this.rotation -= 2 * Math.PI;
		this.skateboard.rotation.y = this.rotation;
		// this.skateboard.rotation.y = Math.round(this.skateboard.rotation.y, 2);
	}

	move() {
		if (this.keyListener.isKeyPressed(KEY_CODES.A)) {
			if (!this.isFacingDirection(SKATEBOARD.LEFT.AMOUNT)) {
				this.turn(SKATEBOARD.LEFT.AMOUNT, SKATEBOARD.LEFT.OPPOSITE);
			}
			this.moveBoardAndCamera();
		} else if (this.keyListener.isKeyPressed(KEY_CODES.D)) {
			if (!this.isFacingDirection(SKATEBOARD.RIGHT.AMOUNT)) {
				this.turn(SKATEBOARD.RIGHT.AMOUNT, SKATEBOARD.RIGHT.OPPOSITE);
			}
			this.moveBoardAndCamera();
		} else if (this.keyListener.isKeyPressed(KEY_CODES.W)) {
			if (!this.isFacingDirection(SKATEBOARD.UP.AMOUNT)) {
				this.turn(SKATEBOARD.UP.AMOUNT, SKATEBOARD.UP.OPPOSITE);
			}
			// this.x -= 0.01;
			this.moveBoardAndCamera();
		} else if (this.keyListener.isKeyPressed(KEY_CODES.S)) {
			if (!this.isFacingDirection(SKATEBOARD.DOWN.AMOUNT)) {
				this.turn(SKATEBOARD.DOWN.AMOUNT, SKATEBOARD.DOWN.OPPOSITE);
			}
			this.moveBoardAndCamera();
		}
	}

	moveBoardAndCamera() {
		this.skateboard.translateZ(-SKATEBOARD.SPEED);
		const newPosition = new THREE.Vector3(CAMERA.X, CAMERA.Y, CAMERA.Z);
		newPosition.add(this.skateboard.position);
		this.camera.position.copy(newPosition);
	}
	// directions are multiples of pi and 4, convert to positive
	// angle with mod and determine if angle is less clockwise
	// if less clockwise, turn clockwise
	isLessClockwise(angle, direction) {
		let diff = direction - angle;
		if (diff < 0) diff += 2 * Math.PI;
		else if (diff > 2 * Math.PI) diff -= 2 * Math.PI;
		return diff > Math.PI;
	}
	isFacingDirection(direction) {
		let result = Math.abs(this.rotation - direction);
		let otherResult = Math.abs(this.rotation - direction - 2 * Math.PI);
		if (result <= SKATEBOARD.ROTATION || otherResult <= SKATEBOARD.ROTATION) {
			this.skateboard.rotation.y = direction;
			return true;
		}
		return false;
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
		const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x1f86ed });
		// const geo = new THREE.ExtrudeGeometry(nose, extrudeSettings);
		// const noseGeometry = new THREE.ShapeGeometry(nose);
		const noseGeometry = new THREE.ExtrudeGeometry(nose, extrudeSettings);
		noseGeometry.center();
		const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
		const noseAngle = Math.PI / 8;

		let yTranslate = (noseLength / 2) * Math.sin(noseAngle);
		// to align bottom corner of nose to skateboard
		let alignBottomCorner =
			SKATEBOARD.HEIGHT * Math.cos(Math.PI / 2 - noseAngle);
		let zTranslate =
			SKATEBOARD.LENGTH / 2 +
			(noseLength / 2) * Math.cos(noseAngle) -
			alignBottomCorner;
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

	isOnTop(position) {
		console.log('fdsa', position, this.skateboard.x, this.skateboard.z);
		let result =
			position.x < this.skateboard.position.x + SKATEBOARD.WIDTH / 2 &&
			position.x > this.skateboard.position.x - SKATEBOARD.WIDTH / 2 &&
			position.z < this.skateboard.position.z + SKATEBOARD.LENGTH / 2 &&
			position.z > this.skateboard.position.z - SKATEBOARD.LENGTH / 2;
		console.log({ result });
		return result;
	}
}

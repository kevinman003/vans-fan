import * as THREE from 'three';

import Skateboard from './Skateboard';
import Animations from './Animations';
import Popups from './Popups';
import World from './World';

import KeyListener from './utils/KeyListener';
import { CAMERA } from './utils/constants/constants';
import { TrackballControls } from './utils/TrackballControls';

export default class Game {
	constructor() {
		this.camera;
		this.renderer;
		this.scene = new THREE.Scene();

		this.initCamera();
		this.initRenderer();
		this.initLighting();
		this.addPlanes();

		this.keyListener = new KeyListener();

		let animations = new Animations();
		let world = new World(this.scene, this.camera);
		this.skateboard = new Skateboard(this.scene, this.camera, this.keyListener);
		const locations = [new THREE.Vector3(0, 0, 0)];
		this.popups = new Popups(
			this.scene,
			this.camera,
			locations,
			this.skateboard
		);

		document.body.appendChild(this.renderer.domElement);
	}

	addPlanes() {
		var planeW = 50; // pixels
		var planeH = 50; // pixels
		var numW = 50; // how many wide (50*50 = 2500 pixels wide)
		var numH = 50; // how many tall (50*50 = 2500 pixels tall)
		var plane = new THREE.Mesh(
			new THREE.PlaneGeometry(planeW * numW, planeH * numH, planeW, planeH),
			new THREE.MeshBasicMaterial({
				color: 0xff0000,
				wireframe: true,
			})
		);
		this.scene.add(plane);
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0xffffff, 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.render(this.scene, this.camera);
	}

	initCamera() {
		const width = 10;
		const height = width * (window.innerHeight / window.innerWidth);
		this.camera = new THREE.OrthographicCamera(
			width / -2,
			width / 2,
			height / 2,
			height / -2,
			1,
			1000
		);

		this.camera.position.set(CAMERA.X, CAMERA.Y, CAMERA.Z);
		this.camera.lookAt(0, 0, 0);
	}

	initLighting() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
		directionalLight.position.set(-CAMERA.X, CAMERA.Y, CAMERA.Z);
		this.scene.add(directionalLight);
	}
}

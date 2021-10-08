import * as THREE from 'three';

import Skateboard from './Skateboard';
import Animations from './Animations';
import KeyListener from './utils/KeyListener';
import { TrackballControls } from './utils/TrackballControls';

export default class Game {
	constructor() {
		this.keyListener = new KeyListener();

		this.scene = new THREE.Scene();

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
		directionalLight.position.set(10, 20, 0);
		this.scene.add(directionalLight);

		const width = 10;
		const height = width * (window.innerHeight / window.innerWidth);
		this.camera = new THREE.OrthographicCamera(
			width / -2,
			width / 2,
			height / 2,
			height / -2,
			1,
			100
		);

		this.camera.position.set(50, 50, 50);
		this.camera.lookAt(0, 0, 0);

		// this.camera = new THREE.PerspectiveCamera(
		// 	10,
		// 	window.innerWidth / window.innerHeight,
		// 	1,
		// 	1000
		// );
		// this.camera.position.set(0, 0, 500);
		let animations = new Animations();
		this.skateboard = new Skateboard(this.scene, this.camera, this.keyListener);
		// animations.addAnimation(() => {
		// 	this.skateboard.rotation.y += 0.01;
		// 	this.renderer.render(this.scene, this.camera);
		// });

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0xffffff, 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.render(this.scene, this.camera);

		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', this.reRender);
		this.controls = new TrackballControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.minDistance = 0.01;
		this.controls.maxDistance = 10;
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

	reRender() {
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

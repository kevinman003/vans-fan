import * as THREE from 'three';

import Skateboard from './Skateboard';
import Animations from './Animations';
import KeyListener from './utils/KeyListener';

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

		let animations = new Animations();
		this.skateboard = new Skateboard(this.scene, this.camera, this.keyListener);
		// animations.addAnimation(() => {
		// 	this.skateboard.rotation.y += 0.01;
		// 	this.renderer.render(this.scene, this.camera);
		// });

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.render(this.scene, this.camera);

		document.body.appendChild(this.renderer.domElement);
		window.addEventListener('resize', this.reRender);
	}

	reRender() {
		console.log('changing');
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

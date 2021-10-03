import '../style.css';

import Game from './Game';
import * as THREE from 'three';
// Global vars
let camera, scene, renderer, skateboard;
camera = 1;
scene = 2;
renderer = 3;
skateboard = 4;

let game = new Game();

animate();

function animate() {
	// console.log('zxcv', game.skateboard.animation);
	requestAnimationFrame(animate);

	game.skateboard.animation();

	game.renderer.render(game.scene, game.camera);
}

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
// 	75,
// 	window.innerWidth / window.innerHeight,
// 	0.1,
// 	1000
// );
// const renderer = new THREE.WebGLRenderer({
// 	canvas: document.querySelector('#bg'),
// });

// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.setZ(30);

// // renderer.render(scene, camera);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({
// 	color: 0xff6347,
// 	wireframe: true,
// });

// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// function animate() {
// 	requestAnimationFrame(animate);
// 	torus.rotation.x += 0.01;

// 	renderer.render(scene, camera);
// }

// animate();

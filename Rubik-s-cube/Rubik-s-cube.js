var container;
var camera, scene, renderer, controls;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var loadingManager = new window.THREE.LoadingManager();


function init() {
	container = document.getElementById('container');

	renderer = new window.THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	camera = new window.THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(10, 10, 10);
	controls = new window.THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 7;
	controls.maxDistance = 80;
	controls.enablePan = false;
	controls.addEventListener('change', render);
	scene = new window.THREE.Scene();

	/*Light*/

	scene.add(new window.THREE.AmbientLight(0xffffff));

	var loaderJSON = new window.THREE.JSONLoader();

	loaderJSON.load('rubik.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({
			map: new window.THREE.TextureLoader(loadingManager).load("diffuse.png"),
			normalMap: new window.THREE.TextureLoader(loadingManager).load("normalCycles.png")
		}); //, shininess: 256
		var modelJSON = new window.THREE.Mesh(geometryJSON, material);
		scene.add(modelJSON);
	});

	loaderJSON.load('plane.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({
			map: new window.THREE.TextureLoader(loadingManager).load("diffusePlane.png")
		});
		var modelJSON = new window.THREE.Mesh(geometryJSON, material);
		scene.add(modelJSON);
	});
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

loadingManager.onLoad = function () {
	render();
};

function render() {
	renderer.render(scene, camera);
}

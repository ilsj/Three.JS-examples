var container;
var camera, scene, renderer, controls;
var meshContainer;
var modeliPhone6sPlus, modeliPhone6sFrontPanel, modeliPhone6sBorder, modeliPhone6sApple, modeliPhone6sBackText;
var video, videoImage, videoImageContext, videoTexture;

function init() {
	container = document.getElementById('container');

	renderer = new window.THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	camera = new window.THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
	camera.position.set(-1.4, 0, 1.4);

	controls = new window.THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1.2;
	controls.maxDistance = 2.5;
	controls.enablePan = false;

	scene = new window.THREE.Scene();

	var colorsLib = {
		'Gold': 0xaa9944,
		'SilverB': 0xDDDFDE,
		'SilverFP': 0xF1F3F4,
		'SilverBr': 0xABACAD,
		'SilverA': 0x232424,
		'SilverBT': 0x232424,
		'GoldB': 0xE3D0BA,
		'GoldFP': 0xF6F8F9,
		'GoldBr': 0xF5F6F7,
		'GoldA': 0x3B230A,
		'GoldBT': 0x3B230A,
		'SpaceGrayB': 0xABAEB1,
		'SpaceGrayFP': 0x050505,
		'SpaceGrayBr': 0x85878A,
		'SpaceGrayA': 0x18191E,
		'SpaceGrayBT': 0x18191E,
		'RoseGoldB': 0xEDCCBD,
		'RoseGoldFP': 0xF1F3F4,
		'RoseGoldBr': 0xE8E9EA,
		'RoseGoldA': 0x471C16,
		'RoseGoldBT': 0x471C16
	};

	var directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(100, 50, 100);
	scene.add(directionalLight);

	var directionalLightBack = new window.THREE.DirectionalLight(0xffffff, 0.3);
	directionalLightBack.position.set(-100, 50, -100);
	scene.add(directionalLightBack);

	var hemisphereLight = new window.THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
	scene.add(hemisphereLight);

	// create the video element
	video = document.createElement('video');
	video.src = 'silver_device_screen.mp4';
	video.load();
	video.play();
	videoImage = document.createElement('canvas');
	videoImage.width = 656;
	videoImage.height = 1168;
	videoImageContext = videoImage.getContext('2d');
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
	videoTexture = new window.THREE.Texture(videoImage);
	videoTexture.minFilter = window.THREE.LinearFilter;
	videoTexture.magFilter = window.THREE.LinearFilter;

	meshContainer = new window.THREE.Group();
	meshContainer.scale.set(10, 10, 10);
	scene.add(meshContainer);

	var loaderJSON = new window.THREE.JSONLoader();

	loaderJSON.load('iPhone6sPlusBody.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({ color: colorsLib.SilverB, specular: 0xbbaa99, shininess: 50 });
		modeliPhone6sPlus = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modeliPhone6sPlus);
	});

	loaderJSON.load('iPhone6sPlusFrontPanel.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({ color: colorsLib.SilverFP, specular: 0xbbaa99, shininess: 50 });
		modeliPhone6sFrontPanel = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modeliPhone6sFrontPanel);
	});

	loaderJSON.load('iPhone6sPlusBorder.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({ color: colorsLib.SilverBr, specular: 0xbbaa99, shininess: 50 });
		modeliPhone6sBorder = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modeliPhone6sBorder);
	});

	loaderJSON.load('iPhone6sPlusApple.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({ color: colorsLib.SilverA, specular: 0xbbaa99, shininess: 50 });
		modeliPhone6sApple = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modeliPhone6sApple);
	});

	loaderJSON.load('iPhone6sPlusBackText.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({ color: colorsLib.SilverBT, specular: 0xbbaa99, shininess: 50, alphaMap:  new window.THREE.TextureLoader().load('backText.png'), transparent: true, opacity: 1 });
		modeliPhone6sBackText = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modeliPhone6sBackText);
	});

	loaderJSON.load('iPhone6sPlusLight.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({color: 0xFFFFFF, specular: 0xbbaa99, shininess: 50}); //
		var modelJSON = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modelJSON);
	});

	loaderJSON.load('iPhone6sPlusScreen.json', function (geometryJSON) {
		var movieMaterial = new window.THREE.MeshPhongMaterial({ map:  videoTexture, overdraw:  true, shininess:  256 });
		var modelJSON = new window.THREE.Mesh(geometryJSON, movieMaterial);
		meshContainer.add(modelJSON);
	});

	loaderJSON.load('iPhone6sPlusHoles.json', function (geometryJSON) {
		var material = new window.THREE.MeshPhongMaterial({color: 0x111111, shininess: 50}); //
		var modelJSON = new window.THREE.Mesh(geometryJSON, material);
		meshContainer.add(modelJSON);
	});

	document.getElementById('btnSilver').addEventListener('click', function () {
		changeColors(colorsLib.SilverB, colorsLib.SilverFP, colorsLib.SilverBr, colorsLib.SilverA, colorsLib.SilverBT, 'silver_device_screen.mp4');
	}, false);

	document.getElementById('btnGold').addEventListener('click', function () {
		changeColors(colorsLib.GoldB, colorsLib.GoldFP, colorsLib.GoldBr, colorsLib.GoldA, colorsLib.GoldBT, 'gold_device_screen.mp4');
	}, false);

	document.getElementById('btnSpaceGray').addEventListener('click', function () {
		changeColors(colorsLib.SpaceGrayB, colorsLib.SpaceGrayFP, colorsLib.SpaceGrayBr, colorsLib.SpaceGrayA, colorsLib.SpaceGrayBT, 'space_gray_device_screen.mp4');
	}, false);

	document.getElementById('btnRoseGold').addEventListener('click', function () {
		changeColors(colorsLib.RoseGoldB, colorsLib.RoseGoldFP, colorsLib.RoseGoldBr, colorsLib.RoseGoldA, colorsLib.RoseGoldBT, 'rose_gold_device_screen.mp4');
	}, false);

	var changeColors = function (body, frontPanel, border, appleLogo, backText, videoFile) {
		modeliPhone6sPlus.material.color.set(body);
		modeliPhone6sFrontPanel.material.color.set(frontPanel);
		modeliPhone6sBorder.material.color.set(border);
		modeliPhone6sApple.material.color.set(appleLogo);
		modeliPhone6sBackText.material.color.set(backText);
		video.src = videoFile;
		video.load();
		video.play();
	};
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
}

function render() {
	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		videoImageContext.drawImage(video, 0, 0);
		if (videoTexture) {
			videoTexture.needsUpdate = true;
		}
	}

	renderer.render(scene, camera);
}
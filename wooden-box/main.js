// import { LegacyJSONLoader } from './LegacyJSONLoader.js';
import { View } from './View.js';
/* tslint:disable: max-classes-per-file */
class BoxView extends View {
    constructor(containerId) {
        super(containerId);
        this._renderer.setSize(512, 512);
    }
    setCameraPosition(position) {
        this._camera.position.copy(position);
        this._camera.lookAt(this._scene.position);
    }
    /** @override */
    _createCamera() {
        this._camera = new THREE.PerspectiveCamera(32, 512 / 512, 0.1, 10);
    }
    /** @override */
    _onWindowResize() {
        // this.render();
    }
}
class BigImage {
    constructor() {
        this._canvas = document.createElement('canvas');
        this._div = document.getElementById('big-container');
        this._imageSize = 512;
        this._canvasContext = this._canvas.getContext('2d');
        this._div.appendChild(this._canvas);
    }
    drawImage(image) {
        this._currentView = image;
        this._canvas.width = this._imageSize;
        this._canvas.height = this._imageSize;
        this._canvasContext.drawImage(image, 0, 0, this._imageSize, this._imageSize);
    }
    update() {
        this.drawImage(this._currentView);
    }
}
class SubView {
    constructor(cameraPosition, view, bigImage) {
        this.canvas = document.createElement('canvas');
        this._imageSize = 512;
        this.cameraPosition = cameraPosition;
        this._view = view;
        this._bigImage = bigImage;
        this._canvasContext = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', () => this.drawBigImage());
        const div = document.getElementById('sub-containers');
        div.appendChild(this.canvas);
    }
    drawBigImage() {
        this._bigImage.drawImage(this.canvas);
    }
    update() {
        this.canvas.width = this._imageSize;
        this.canvas.height = this._imageSize;
        this._view.setCameraPosition(this.cameraPosition);
        this._view.render();
        this._canvasContext.drawImage(this._view.canvas, 0, 0, this._imageSize, this._imageSize);
    }
}
class SubViews {
    constructor(view) {
        this._bigImage = new BigImage();
        this._viewPositions = [
            new THREE.Vector3(-0.5, 0.5, 1),
            new THREE.Vector3(0, 0.5, 1),
            new THREE.Vector3(1, 0.5, 1),
        ];
        this._subs = this._viewPositions.map((position) => new SubView(position, view, this._bigImage));
        this._subs[0].drawBigImage();
    }
    update() {
        this._subs.forEach((sub) => sub.update());
        this._bigImage.update();
    }
}
class Logos {
    constructor(onclick) {
        this._images = document.querySelectorAll('#logos-container img');
        this._images.forEach((logo) => {
            logo.addEventListener('click', () => onclick(logo));
        });
    }
}
class BoxTexture {
    constructor(onLoad) {
        this.texture = null;
        this._canvas = document.createElement('canvas');
        this._onLoad = onLoad;
        this.texture = new THREE.CanvasTexture(this._canvas);
        this._canvasContext = this._canvas.getContext('2d');
        this._loadImage();
        const logos = new Logos((image) => this._drawLogo(image));
    }
    _drawLogo(image) {
        this._drawTexture(this._image);
        // const width: number = 498;
        // const height: number = 306;
        const left = 121;
        const top = 94 + 25;
        this._canvasContext.drawImage(image, left, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 518, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 1032, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 1550, top, image.naturalWidth, image.naturalHeight);
        this.texture.needsUpdate = true;
        this._onLoad();
    }
    _drawTexture(image) {
        this._canvas.width = image.width;
        this._canvas.height = image.height;
        this._canvasContext.drawImage(image, 0, 0, image.width, image.height);
    }
    _loadImage() {
        const loader = new THREE.ImageLoader();
        this._image = loader.load('box.jpg', (image) => {
            this._drawTexture(image);
            this._onLoad();
        });
    }
}
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const view = new BoxView('main-container');
        const subViews = new SubViews(view);
        const loader = new THREE.JSONLoader();
        loader.load('Box.json', (geometry) => {
            const texture = new BoxTexture(() => subViews.update());
            const material = new THREE.MeshBasicMaterial({
                // color: 0x888888,
                map: texture.texture,
            });
            const box = new THREE.Mesh(geometry, material);
            box.position.y = -0.18;
            view.add(box);
        });
    });
})();

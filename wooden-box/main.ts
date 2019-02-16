import * as ITHREE from './three-core'; // For THREE JS interfaces
declare const THREE: typeof ITHREE; // For THREE JS library (window.THREE)

// import { LegacyJSONLoader } from './LegacyJSONLoader.js';
import { View } from './View.js';

/* tslint:disable: max-classes-per-file */

class BoxView extends View {
    public constructor(containerId: string) {
        super(containerId);

        this._renderer.setSize(512, 512);
    }

    public setCameraPosition(position: ITHREE.Vector3): void {
        this._camera.position.copy(position);
        this._camera.lookAt(this._scene.position);
    }

    /** @override */
    protected _createCamera(): void {
        this._camera = new THREE.PerspectiveCamera(32, 512 / 512, 0.1, 10);
    }

    /** @override */
    protected _onWindowResize(): void {
        // this.render();
    }
}

class BigImage {
    private _canvas: HTMLCanvasElement = document.createElement('canvas');
    private _canvasContext: CanvasRenderingContext2D;

    private _currentView: HTMLCanvasElement;

    private _div: HTMLElement = document.getElementById('big-container');

    private _imageSize: number = 512;

    public constructor() {
        this._canvasContext = this._canvas.getContext('2d');
        this._div.appendChild(this._canvas);
    }

    public drawImage(image: HTMLCanvasElement): void {
        this._currentView = image;

        this._canvas.width = this._imageSize;
        this._canvas.height = this._imageSize;
        this._canvasContext.drawImage(image, 0, 0, this._imageSize, this._imageSize);
    }

    public update(): void {
        this.drawImage(this._currentView);
    }
}

class SubView {
    public cameraPosition: ITHREE.Vector3;
    public canvas: HTMLCanvasElement = document.createElement('canvas');

    private _bigImage: BigImage;
    private _canvasContext: CanvasRenderingContext2D;
    private _imageSize: number = 512;

    private _view: BoxView;

    public constructor(cameraPosition: ITHREE.Vector3, view: BoxView, bigImage: BigImage) {
        this.cameraPosition = cameraPosition;
        this._view = view;
        this._bigImage = bigImage;

        this._canvasContext = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', () => this.drawBigImage());

        const div: HTMLElement = document.getElementById('sub-containers');
        div.appendChild(this.canvas);
    }

    public drawBigImage(): void {
        this._bigImage.drawImage(this.canvas);
    }

    public update(): void {
        this.canvas.width = this._imageSize;
        this.canvas.height = this._imageSize;

        this._view.setCameraPosition(this.cameraPosition);
        this._view.render();
        this._canvasContext.drawImage(this._view.canvas, 0, 0, this._imageSize, this._imageSize);
    }
}

class SubViews {
    private _bigImage: BigImage = new BigImage();
    private _subs: SubView[];

    private _viewPositions: ITHREE.Vector3[] = [
        new THREE.Vector3(-0.5, 0.5, 1),
        new THREE.Vector3(0, 0.5, 1),
        new THREE.Vector3(1, 0.5, 1),
    ];

    public constructor(view: BoxView) {
        this._subs = this._viewPositions.map((position: ITHREE.Vector3) =>
            new SubView(position, view, this._bigImage));

        this._subs[0].drawBigImage();
    }

    public update(): void {
        this._subs.forEach((sub: SubView) => sub.update());
        this._bigImage.update();
    }
}

class Logos {
    private _images: NodeListOf<HTMLImageElement> = document.querySelectorAll('#logos-container img');

    public constructor(onclick: (image: HTMLImageElement) => void) {
        this._images.forEach((logo: HTMLImageElement) => {
            logo.addEventListener('click', () => onclick(logo));
        });
    }
}

class BoxTexture {
    public texture: ITHREE.CanvasTexture | null = null;

    private _canvas: HTMLCanvasElement = document.createElement('canvas');
    private _canvasContext: CanvasRenderingContext2D;
    private _image: HTMLImageElement;

    private _onLoad: () => void;

    public constructor(onLoad: () => void) {
        this._onLoad = onLoad;

        this.texture = new THREE.CanvasTexture(this._canvas);

        this._canvasContext = this._canvas.getContext('2d');

        this._loadImage();

        const logos: Logos = new Logos((image: HTMLImageElement): void => this._drawLogo(image));
    }

    private _drawLogo(image: HTMLImageElement): void {
        this._drawTexture(this._image);

        // const width: number = 498;
        // const height: number = 306;
        const left: number = 121;
        const top: number = 94 + 25;

        this._canvasContext.drawImage(image, left, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 518, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 1032, top, image.naturalWidth, image.naturalHeight);
        this._canvasContext.drawImage(image, left + 1550, top, image.naturalWidth, image.naturalHeight);

        this.texture.needsUpdate = true;

        this._onLoad();
    }

    private _drawTexture(image: HTMLImageElement): void {
        this._canvas.width = image.width;
        this._canvas.height = image.height;
        this._canvasContext.drawImage(image, 0, 0, image.width, image.height);
    }

    private _loadImage(): void {
        const loader: ITHREE.ImageLoader = new THREE.ImageLoader();
        this._image = loader.load('box.jpg', (image: HTMLImageElement) => {
            this._drawTexture(image);
            this._onLoad();
        });
    }
}

((): void => {
    document.addEventListener('DOMContentLoaded', (): void => {
        const view: BoxView = new BoxView('main-container');

        const subViews: SubViews = new SubViews(view);

        const loader: ITHREE.JSONLoader = new THREE.JSONLoader();
        loader.load('Box.json', (geometry: ITHREE.Geometry): void => {
            const texture: BoxTexture = new BoxTexture((): void => subViews.update());

            const material: ITHREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
                // color: 0x888888,
                map: texture.texture,
            });

            const box: ITHREE.Mesh = new THREE.Mesh(geometry, material);
            box.position.y = -0.18;

            view.add(box);
        });
    });
})();

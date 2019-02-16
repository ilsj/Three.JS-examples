import { IPoint } from './interfaces';
import * as ITHREE from './three-core'; // For THREE JS interfaces
declare const THREE: typeof ITHREE; // For THREE JS (window.THREE)

export class View {
    public canvas: HTMLCanvasElement;
    public onSurfaceClick: (surface: any) => void;

    protected _camera: ITHREE.PerspectiveCamera;
    protected _renderer: ITHREE.WebGLRenderer;
    protected _scene: ITHREE.Scene;

    private _animationEnabled: boolean = false;
    private readonly _rayCaster: ITHREE.Raycaster = new THREE.Raycaster();

    public constructor(containerId: string) {
        this._createRenderer(containerId);
        this._createScene();
        this._createCamera();

        window.addEventListener('resize', () => this._onWindowResize(), false);

        // this._scene.add(createPanorama(room));
        // addTiledSurfaces();
    }

    public add(mesh: ITHREE.Object3D): void {
        this._scene.add(mesh);
    }

    /**
     * @param {MouseEvent} event
     * @param {ITHREE.Object3D[]} objects Array of objects (default this._scene.children)
     * @param {Boolean} recursive If true, it also checks all descendants
     * @returns {ITHREE.Intersection[]} Intersect Objects
     */
    public getIntersects(
        event: MouseEvent,
        objects?: ITHREE.Object3D[],
        recursive: boolean = false,
    ): ITHREE.Intersection[] {
        const normalizedPoint: IPoint = {
            x: event.offsetX / this.canvas.scrollWidth * 2 - 1,
            y: -event.offsetY / this.canvas.scrollHeight * 2 + 1,
        };

        this._rayCaster.setFromCamera(normalizedPoint, this._camera);

        return this._rayCaster.intersectObjects(objects || this._scene.children, recursive);
    }

    /**
     * Check if any object in objects array intersects with current rayCaster
     * @param {Array} objects
     * @returns {Boolean} - Intersect Objects
     */
    public isIntersect(objects: ITHREE.Object3D[]): boolean {
        if (!Array.isArray(objects) || objects.length === 0) {
            return false;
        }

        this._render(); //todo optimize

        const intersects: ITHREE.Intersection[] = this._rayCaster.intersectObjects(objects);

        return intersects.length > 0;
    }

    public render(): void {
        if (this._animationEnabled) {
            return;
        }
        this._render();
    }

    public startAnimation(): void {
        this._animationEnabled = true;
        this._renderer.setAnimationLoop(() => this._render());
    }

    public stopAnimation(): void {
        this._animationEnabled = false;
        this._renderer.setAnimationLoop(null);
    }

    protected _createCamera(): void {
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    }

    protected _createRenderer(containerId: string): void {
        this._renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setClearColor(0xFFFFFF);
        const container: HTMLElement = document.getElementById(containerId);
        container.appendChild(this._renderer.domElement);
        this.canvas = this._renderer.domElement;
        // this.canvas.addEventListener('click', sceneMouseClick);
        // this.canvas.addEventListener('touchstart', sceneMouseClick);
    }

    protected _createScene(): void {
        this._scene = new THREE.Scene();
    }

    protected _onWindowResize(): void {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }

    protected _render(): void {
        this._renderer.render(this._scene, this._camera);
    }
}

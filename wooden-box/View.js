export class View {
    constructor(containerId) {
        this._animationEnabled = false;
        this._rayCaster = new THREE.Raycaster();
        this._createRenderer(containerId);
        this._createScene();
        this._createCamera();
        window.addEventListener('resize', () => this._onWindowResize(), false);
        // this._scene.add(createPanorama(room));
        // addTiledSurfaces();
    }
    add(mesh) {
        this._scene.add(mesh);
    }
    /**
     * @param {MouseEvent} event
     * @param {ITHREE.Object3D[]} objects Array of objects (default this._scene.children)
     * @param {Boolean} recursive If true, it also checks all descendants
     * @returns {ITHREE.Intersection[]} Intersect Objects
     */
    getIntersects(event, objects, recursive = false) {
        const normalizedPoint = {
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
    isIntersect(objects) {
        if (!Array.isArray(objects) || objects.length === 0) {
            return false;
        }
        this._render(); //todo optimize
        const intersects = this._rayCaster.intersectObjects(objects);
        return intersects.length > 0;
    }
    render() {
        if (this._animationEnabled) {
            return;
        }
        this._render();
    }
    startAnimation() {
        this._animationEnabled = true;
        this._renderer.setAnimationLoop(() => this._render());
    }
    stopAnimation() {
        this._animationEnabled = false;
        this._renderer.setAnimationLoop(null);
    }
    _createCamera() {
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    }
    _createRenderer(containerId) {
        this._renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setClearColor(0xFFFFFF);
        const container = document.getElementById(containerId);
        container.appendChild(this._renderer.domElement);
        this.canvas = this._renderer.domElement;
        // this.canvas.addEventListener('click', sceneMouseClick);
        // this.canvas.addEventListener('touchstart', sceneMouseClick);
    }
    _createScene() {
        this._scene = new THREE.Scene();
    }
    _onWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
    _render() {
        this._renderer.render(this._scene, this._camera);
    }
}

import * as THREE from './three-core';

export interface IPoint {
    x: number;
    y: number;
}

export interface IPoint3d extends IPoint {
    z: number;
}

export interface ISettingsData {
    height: number;
}

export interface ISurfaceData {
    type: string;
}

export interface IObject extends THREE.Object3D {
  surface: ISurface;
}

export interface ISurface {
  freeDesign: boolean;
  freeDesignTiles: any[];
  isTiledSurface: boolean;
  mesh: THREE.Object3D;

  backLight(): void;
  freeDesignClick(
    tileIntersects: THREE.Intersection[],
    intersectPoint: IPoint,
    callback: (objects: IObject[]) => void,
  ): void;

  hideBackLight(): void;
  rotateTile(object: THREE.Object3D): void;
}

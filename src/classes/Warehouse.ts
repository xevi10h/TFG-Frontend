import { Point } from "mapbox-gl";

export default class Warehouse {
  private readonly _id: number;
  private readonly _isAutomatic: boolean;
  private readonly _radius: number;
  private readonly _coordinates?: Point;
  private readonly _name?: string;
  private readonly _strategy?: string;
  private readonly _absorbedLoad?: number;
  private _isFixed?: boolean;

  constructor(
    id: number,
    isAutomatic: boolean,
    radius: number,
    coordinates?: Point,
    name?: string,
    strategy?: string,
    absorbedLoad?: number,
    isFixed?: boolean
  ) {
    this._id = id;
    this._isAutomatic = isAutomatic;
    this._coordinates = coordinates;
    this._radius = radius;
    this._name = name;
    this._strategy = strategy;
    this._absorbedLoad = absorbedLoad;
    this._isFixed = isFixed;
  }

  public get id(): number {
    return this._id;
  }

  public get isAutomatic(): boolean {
    return this._isAutomatic;
  }

  public get coordinates(): Point {
    return this._coordinates;
  }

  public get radius(): number {
    return this._radius;
  }

  public get name(): string {
    return this._name;
  }

  public get strategy(): string {
    return this._strategy;
  }

  public get absorbedLoad(): number {
    return this._absorbedLoad;
  }

  public get isFixed(): boolean {
    return this._isFixed;
  }

  public set isFixed(isFixed: boolean) {
    this._isFixed = isFixed;
  }

  public get serialize(): any {
    return {
      id: this.id,
      isAutomatic: this.isAutomatic,
      radius: this.radius,
      coordinates: this.coordinates,
      name: this.name,
      strategy: this.strategy,
      absorbedLoad: this.absorbedLoad,
      isFixed: this.isFixed,
    };
  }
}

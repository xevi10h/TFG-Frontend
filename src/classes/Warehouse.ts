import { Point } from "mapbox-gl";

export default class Warehouse {
  private readonly _id: number;
  private readonly _isAutomatic: boolean;
  private readonly _radius: number;
  private readonly _coordinates?: Point;
  private readonly _name?: string;

  constructor(id: number, isAutomatic: boolean, radius: number, coordinates?: Point, name?: string) {
    this._id = id;
    this._isAutomatic = isAutomatic;
    this._coordinates = coordinates;
    this._radius = radius;
    this._name = name;
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

  public get serialize(): any {
    return {
      id: this.id,
      isAutomatic: this.isAutomatic,
      radius: this.radius,
      coordinates: this.coordinates,
      name: this.name,
    };
  }
}

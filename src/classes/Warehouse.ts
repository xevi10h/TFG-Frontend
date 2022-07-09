import { Point } from "mapbox-gl";

export default class Warehouse {
  private readonly _id: string;
  private readonly _coordinates: Point;
  private readonly _radius: number;

  constructor(id: string, coordinates: Point, radius: number) {
    this._id = id;
    this._coordinates = coordinates;
    this._radius = radius;
  }

  public get id(): string {
    return this._id;
  }

  public get coordinates(): Point {
    return this._coordinates;
  }

  public get radius(): number {
    return this._radius;
  }

  public get serializeMapBox(): any {
    return {
      id: this.id,
      coordinates: this.coordinates,
      radius: this.radius,
    };
  }
}

import { GeoJSONSourceRaw, Point } from "mapbox-gl";

export default class Area {
  private readonly _id: number;
  private readonly _coordinates: Array<Array<number>>;
  private _value: number;

  constructor(id: number, coordinates: Array<Array<number>>, value: number = 0) {
    this._id = id;
    this._coordinates = coordinates;
    this._value = value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get value(): number {
    return this._value;
  }

  public get coordinates(): Array<Array<number>> {
    return this._coordinates;
  }

  public get id(): number {
    return this._id;
  }

  public get centerPoint(): Point {
    return new Point(
      (this._coordinates[0][1] - this._coordinates[0][0]) / 2 + this._coordinates[0][0],
      (this._coordinates[1][1] - this._coordinates[1][0]) / 2 + this._coordinates[1][0]
    );
  }

  public get coordinatesForMapbox(): Array<Array<Array<number>>> {
    return [
      [
        [this._coordinates[0][0], this._coordinates[1][0]],
        [this._coordinates[0][1], this._coordinates[1][0]],
        [this._coordinates[0][1], this._coordinates[1][1]],
        [this._coordinates[0][0], this._coordinates[1][1]],
        [this._coordinates[0][0], this._coordinates[1][0]],
      ],
    ];
  }

  public get serializeMapBox(): GeoJSONSourceRaw {
    return {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: this.coordinatesForMapbox,
        },
        properties: {
          value: this._value,
        },
      },
    };
  }
}

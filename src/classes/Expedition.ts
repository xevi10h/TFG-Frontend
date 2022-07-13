import { GeoJSONSourceRaw, Point } from "mapbox-gl";

export default class Expedition {
  date: string;
  weight: number;
  volume: number;
  coordinates: Point;

  constructor(date: string, weight: number, volume: number, coordinates: Point) {
    this.date = date;
    this.weight = weight || 0;
    this.volume = volume || 0;
    this.coordinates = coordinates;
  }

  public get serializeMapBox(): GeoJSONSourceRaw {
    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [-76.53063297271729, 39.18174077994108],
            },
          },
        ],
      },
    };
  }
}

import { Point } from "mapbox-gl";

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
}

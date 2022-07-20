import { Point } from "mapbox-gl";

export interface rawWarehouse {
  id: number;
  isAutomatic: boolean;
  radius: number;
  coordinates: Point;
  name?: string;
  strategy?: string;
  absorbedLoad?: number;
  isFixed?: boolean;
}

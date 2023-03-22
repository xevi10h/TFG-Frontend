import { Point } from "mapbox-gl";
import IWarehouse from "../interfaces/IWarehouse";

export default class Warehouse {
  private _id: String;
  createdAt: Date;
  updatedAt: Date;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  radius: number;
  capacity: number;
  name: String;
  isAutomatic: Boolean;
  priority: number;
  model: String;
  maxRadius?: number;
  maxCapacity?: number;

  constructor(warehouse: IWarehouse) {
    this._id = warehouse._id;
    this.createdAt = warehouse.createdAt;
    this.updatedAt = warehouse.updatedAt;
    this.coordinates = warehouse.coordinates;
    this.radius = warehouse.radius;
    this.capacity = warehouse.capacity;
    this.name = warehouse.name;
    this.isAutomatic = warehouse.isAutomatic;
    this.priority = warehouse.priority;
    this.model = warehouse.model;
    this.maxRadius = warehouse.maxRadius;
    this.maxCapacity = warehouse.maxCapacity;
  }

  public get id(): String {
    return this._id;
  }

  public get serialize(): any {
    return {
      id: this.id,
      isAutomatic: this.isAutomatic,
      radius: this.radius,
      coordinates: this.coordinates,
      name: this.name,
      capacity: this.capacity,
    };
  }
}

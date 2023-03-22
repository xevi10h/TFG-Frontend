export default interface IWarehouse {
  _id?: String;
  isAutomatic: boolean;
  model: String;
  coordinates?: {
    longitude: number;
    latitude: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
  priority?: number;
  name?: string;
  radius?: number;
  capacity?: number;
  maxRadius?: number;
  maxCapacity?: number;
}

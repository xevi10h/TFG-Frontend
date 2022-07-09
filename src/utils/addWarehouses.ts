import { Point } from "mapbox-gl";
import Warehouse from "../classes/Warehouse";

interface propsSetWarehouses{
    radius: number,
    numWarehouses: number,
    type: string,
    coordinates: Point
}

export default function addWarehouses(props:propsSetWarehouses):Warehouse[] {
    return new Array<Warehouse>
}
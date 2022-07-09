import { Point } from "mapbox-gl";
import Area from "../classes/Area";
import Expedition from "../classes/Expedition";


function calculateExpeditionValue (expedition: Expedition, configValue): number {
    switch (configValue) {
        case 'equal':
            return 1
        case 'max':
            return Math.max(expedition.volume,expedition.weight)
        case 'min':
            return Math.min(expedition.volume,expedition.weight)
        case 'sum':
            return expedition.volume+expedition.weight
        case 'min':
            return expedition.volume*expedition.weight
        default:
            return 1;
    }
}

interface propsCalculateAreas {
    configValue: string | undefined,
    expeditions: Expedition[]
}

export default function calculateAreasFromExpeditions(props: propsCalculateAreas): Area[] {
    const { configValue, expeditions } = props
    console.log(configValue)
    console.log(expeditions)
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } = expeditions.reduce((prev, curr) => {
        if (curr.coordinates.x < prev.minLatitude) prev.minLatitude = curr.coordinates.x
        if (curr.coordinates.x > prev.maxLatitude) prev.maxLatitude = curr.coordinates.x
        if (curr.coordinates.y < prev.minLongitude) prev.minLongitude = curr.coordinates.y
        if (curr.coordinates.y > prev.maxLongitude) prev.maxLongitude = curr.coordinates.y
        return prev
    }, { minLatitude: 90, maxLatitude: -90, minLongitude: 180, maxLongitude: -180 })
    console.log(minLatitude)
    console.log(maxLatitude)
    console.log(minLongitude)
    console.log(maxLongitude)
    const areas: Array<Area> = [];
    const numDivisions = 20
    const latitudeInterval = (maxLatitude - minLatitude) / numDivisions
    const longitudeInterval = (maxLongitude - minLongitude) / numDivisions
    let indexId=1;
    for (let lat = minLatitude; lat >= minLatitude && lat < maxLatitude; lat = lat + latitudeInterval) {
        for (let long = minLongitude; long >= minLongitude && long < maxLongitude; long = long + longitudeInterval) {
            areas.push(new Area(
                indexId,
                [[lat,lat + latitudeInterval],[long,long + longitudeInterval]]
            ))
            indexId++
        }
    }
    console.log(areas)
    expeditions.forEach((expedition) => {
        const areaAssigned = areas.find((area) =>
            area.coordinates[0][0] <= expedition.coordinates.x &&
            area.coordinates[0][1] >= expedition.coordinates.x &&
            area.coordinates[1][0] <= expedition.coordinates.y &&
            area.coordinates[1][1] >= expedition.coordinates.y
        );
        
        if (areaAssigned){
            areaAssigned.value += calculateExpeditionValue(expedition, configValue)
        } 
    })
    let areasFiltered = areas.filter(area=>area.value>0)
    console.log(areasFiltered)
    return areasFiltered
}
# Processes stops.csv downloaded from TransLink's GTFS Static Data
# https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs/gtfs-data
# Author: Mu Leelawat

import geojson
from enum import Enum

class Properties(Enum):
    LAT = 0
    WHEELCHAIR = 1
    CODE = 2
    LON = 3
    ID = 4
    URL = 5
    PARENT = 6
    DESC = 7
    NAME = 8
    TYPE = 9
    ZONE = 10

filenames = {
    "input (all stops) filename": "./geojson/stops.csv",
    "input (rapid stops) filename": "./geojson/rapidstops.csv",
    "output 1 filename": "./geojson/trainPoints.geojson",
    "output 2 filename": "./geojson/busPoints.geojson"
}

for name, path in filenames.items():
    ask = input(f'Enter the {name} if you do not want to use "{path}": ')
    if ask != "":
        path = ask

tl = []
rs = []

with open(filenames["input (all stops) filename"],"r") as f:
    tl = f.readlines()

with open(filenames["input (rapid stops) filename"], "r") as f:
    rs = f.readlines()

tl = tl[1:]
rs = rs[1:]

trainStations = []
busStops = []

for line in tl:
    stop = line.strip().split(",")

    hasParent = bool(stop[Properties.PARENT.value] != "")
    if hasParent:
        continue

    isTrainStation = bool(stop[Properties.TYPE.value] == "1")
    rapidBusStop = ""

    if not isTrainStation:
        code = stop[Properties.CODE.value]
        for check in rs:
            checkobj = check.strip().split(",")
            if checkobj[1] == code:
                rapidBusStop = checkobj[5]
                break

    lat = stop[Properties.LAT.value]
    lon = stop[Properties.LON.value]
    coord = (float(lon), float(lat))
    point = geojson.Point(coord)

    name = stop[Properties.NAME.value]
    isWheelchairAccessible = bool(stop[Properties.WHEELCHAIR.value] == "1")

    feature = geojson.Feature(geometry=point, properties={
        "name": name,
        "wheelchair": isWheelchairAccessible,
        "rapid": rapidBusStop
    })

    
    if isTrainStation:
        trainStations.append(feature)
    else:
        busStops.append(feature)


collectionTrainStations = geojson.FeatureCollection(trainStations)
collectionBusStops = geojson.FeatureCollection(busStops)

with open(filenames["output 1 filename"], "w") as f:
    geojson.dump(collectionTrainStations, f)

with open(filenames["output 2 filename"], "w") as f:
    geojson.dump(collectionBusStops, f)
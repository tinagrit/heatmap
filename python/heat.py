# Generates a GeoJSON file from available data
# Author: Mu Leelawat

import geojson
import math
import cellinfo

CELL_SIZE_METRES = 250
TOP_LEFT_BOUNDS = (-123.5200, 49.4500)
BOTTOM_RIGHT_BOUNDS = (-122.3600, 48.9500)

LATITUDE_PER_METRE = 1/111320
RADIAN_PER_DEGREE = math.pi/180

cells = []
cellcount = 0

current = [TOP_LEFT_BOUNDS[0], TOP_LEFT_BOUNDS[1]]

print("Iterating through each cell...   ",end="",flush=True)

# Iterate through all cells within the bounds
while (current[1] >= BOTTOM_RIGHT_BOUNDS[1]):
    changeVertical = CELL_SIZE_METRES * LATITUDE_PER_METRE * (1/math.cos(abs(current[1] * RADIAN_PER_DEGREE)))
    while (current[0] <= BOTTOM_RIGHT_BOUNDS[0]):
        changeHorizontal = CELL_SIZE_METRES * LATITUDE_PER_METRE

        TOP_LEFT = (current[0],current[1])
        TOP_RIGHT = (current[0]+changeHorizontal,current[1])
        BOTTOM_LEFT = (current[0],current[1]+changeVertical)
        BOTTOM_RIGHT = (current[0]+changeHorizontal,current[1]+changeVertical)

        polygon = geojson.Polygon([
            TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT, TOP_LEFT
        ])

        score = 1
        
        feature = geojson.Feature(geometry=polygon,properties={
            "static": score
        })

        cells.append(feature)

        cellcount += 1
        current[0] += changeHorizontal
    current[1] -= changeVertical
    current[0] = TOP_LEFT_BOUNDS[0]
    
collectionCells = geojson.FeatureCollection(cells)

print("[✓]\nDumping GeoJSON...   ",end="",flush=True)

with open("./geojson/heatraw.geojson", "w") as f:
    geojson.dump(collectionCells, f)

print(f"[✓]\nOperation successful with {cellcount} processed cells.")
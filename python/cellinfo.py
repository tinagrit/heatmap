import osmium
import osmium.geom
import shapely
import shapely.ops
import shapely.wkb

PBF_PATH = "./geojson/planet_-123.5200,48.9500_-122.3600,49.4500.osm.pbf"

WKBfactory = osmium.geom.WKBFactory()

class Polygon(osmium.SimpleHandler):
    def __init__(self):
        # initialize parent
        super().__init__()

        self.waters = []
    
    def area(self,a):
        if a.tags.get('natural') == 'water':
            try:
                wkb = WKBfactory.create_multipolygon(a)
            except RuntimeError as e:
                return

            shape = shapely.wkb.loads(wkb, hex=True)
            self.waters.append(shape)

print("Parsing OpenStreetMap data...   ",end="",flush=True)

polygons = Polygon()
polygons.apply_file(PBF_PATH,locations=True)

if polygons.waters:
    waterUnion = shapely.ops.unary_union(polygons.waters)

print("[✓]")

def waterRatio(cell):
    if not waterUnion:
        return 0.0

    cellArea = cell.area
    intersection = cell.intersection(waterUnion).area

    ratio = intersection / cellArea
    return ratio
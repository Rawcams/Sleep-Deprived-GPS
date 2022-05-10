import subprocess
import sys
import math


if __name__ == '__main__':

    args = sys.argv[1:]
    
    #start = [13.388860,52.517037]
    #end = [13.428555,52.523219]

    start = [float(args[0]), float(args[1])]
    end = [float(args[2]), float(args[3])]
    
    url = "http://router.project-osrm.org/route/v1/driving/" + str(start[0]) + "," + str(start[1]) + ";" + str(end[0]) + "," + str(end[1]) + "?alternatives=true&geometries=geojson&overview=full"

    change_ele = {}
    list_routes = {}

    # find shortest route
    p = subprocess.run(["curl", url], stdout=subprocess.PIPE, text=True)

    coordinates = p.stdout.split("[[")
    coordinates.remove(coordinates[0])
    index = 0
    for c in coordinates:
        co = "[[" + c.split("]]")[0] + "]]"
        list_routes[index] = co

        # get elevations of each coordinate in route
        ele_url = 'https://elevation.racemap.com/api'
        content_type = 'Content-Type: application/json'
        d = subprocess.run(["curl","-d",co,"-XPOST","-H",content_type,ele_url], stdout=subprocess.PIPE, text=True)
        elevations = d.stdout.strip("][").split(",")

        # calculate total change in elevation
        total = 0.0
        last = 0.0
        for e in elevations:
            if last == 0.0:
                last = e
            else:
                coor = float(e)
                total += abs(abs(coor) - abs(float(last)))
                last = e

        change_ele[index] = total

    #coordinates = p.stdout.split("[[")[1].split("]]")[0]
    #coordinates = "[[" + coordinates + "]]"
    
    # find route with the least change in elevation
    least_ele_index = 0
    small = math.inf
    for d in change_ele.keys():
        if change_ele[d] < small:
            small = change_ele
            least_ele_index = d

    # get summary for that route
    #summary = p.stdout.split("summary")[1].split("}]")[0].split(",")
    summary = p.stdout.split("summary")
    summary.remove(summary[0])

    sum = summary[least_ele_index].split("}]")[0].split(",")

    duration = sum[2].split(":")[1]
    distance = sum[3].split(":")[1]

    # # get elevations of each coordinate in route
    # ele_url = 'https://elevation.racemap.com/api'
    # content_type = 'Content-Type: application/json'
    # d = subprocess.run(["curl","-d",coordinates,"-XPOST","-H",content_type,ele_url], stdout=subprocess.PIPE, text=True)
    # elevations = d.stdout.strip("][").split(",")

    # # calculate total change in elevation
    # total = 0.0
    # last = 0.0
    # for e in elevations:
    #     if last == 0.0:
    #         last = e
    #     else:
    #         coor = float(e)
    #         total += abs(abs(coor) - abs(float(last)))
    #         last = e

    # create strings to write to file
    dist = "Distance: " + distance + "\n"
    dur = "Duration: " + duration + "\n"
    total_ele = "Total Elevation: " + str(change_ele[least_ele_index]) + "\n"
    route = "Route: " + list_routes[least_ele_index] + "\n"

    with open("result.txt","w+") as f:
        f.write(dist)
        f.write(dur)
        f.write(total_ele)
        f.write(route)
        f.close()

    with open("route.txt","w+") as f:
        f.write(route)
        f.close()

from flask import Flask, send_from_directory
import json
import populartimes
from flask import jsonify
from flask import request
from flask_cors import CORS

app = Flask(__name__, static_url_path='')
CORS(app, support_credentials=True)

idling = None
with open('backend/idling.json') as f:
    idling = json.load(f)

busy = []
with open('backend/parks.json') as f:
    busy += json.load(f)

from flask import render_template
@app.route('/', methods=['GET'])
def metrics():
    return render_template("frontend/index/index.html")


"""
swLongitude, swLatitude, neLongitude, neLatitude, hourOfDay
"""
@app.route("/traffic/", methods = ['POST'])
def traffic():
    data = json.loads(request.data)
    swLatitude = float(data['swLatitude'])
    swLongitude = float(data['swLongitude'])
    neLatitude = float(data['neLatitude'])
    neLongitude = float(data['neLongitude'])
    hourOfDay = str(data["hourOfDay"]).zfill(2)
    response = []
    for place in idling:
        lng = float(place["Longitude"])
        lat = float(place["Latitude"])
        if not (swLatitude <= lat <= neLatitude and swLongitude <= lng <= neLongitude):
            continue
        rawVal = str(place["IdlingByHour"])
        idlingByHour = json.loads(rawVal)[str(hourOfDay)]
        response.append({
            "latitude": lat,
            "longitude": lng,
            "percentage": idlingByHour
        })
    return jsonify(response)


@app.route("/placebusyness/", methods=['POST'])
def placebusyness():
    data = json.loads(request.data)
    place_id = data['placeID']
    dayOfWeek = data['dayOfWeek']  # first capitalized day of week
    place = populartimes.get_id("AIzaSyC5xsFHLdEzj_3Ce8l8A2eqxDB0EvAvyQ8", place_id)
    if "populartimes" not in place:
        return jsonify({"response": "NOT_FOUND"})
    val = []
    for day in place["populartimes"]:
        if (day["name"] == dayOfWeek):
            val = day["data"]
            break
    lat = float(place["coordinates"]["lat"])
    lng = float(place["coordinates"]["lng"])
    response = {
        "latitude": lat,
        "longitude": lng,
        "percentage": val
    }
    return jsonify(response)


"""
swLongitude, swLatitude, neLongitude, neLatitude, hourOfDay
"""
@app.route("/busyness/", methods = ['POST'])
def busyness():
    data = json.loads(request.data)
    swLatitude = float(data['swLatitude'])
    swLongitude = float(data['swLongitude'])
    neLatitude = float(data['neLatitude'])
    neLongitude = float(data['neLongitude'])
    hourOfDay = int(data["hourOfDay"])
    response = []
    for place in busy:
        lat = float(place["coordinates"]["lat"])
        lng = float(place["coordinates"]["lng"])
        if not (swLatitude <= lat <= neLatitude and swLongitude <= lng <= neLongitude):
            continue
        hourBusy = 0
        for day in place["populartimes"]:
            d = day["data"]
            hourBusy += d[hourOfDay]
        hourBusy /= 7.0 * 100
        response.append({
            "latitude": lat,
            "longitude": lng,
            "percentage": round(hourBusy*100000)/100000
        })
    return jsonify(response)


if __name__ == '__main__':
    app.run()

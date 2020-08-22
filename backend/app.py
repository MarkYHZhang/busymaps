from flask import Flask
import populartimes
from flask import jsonify
from flask import request
app = Flask(__name__)

"""
sLongitude, sLatitude, eLongitude, sLatitude
"""
@app.route("/heatmap/", methods = ['POST'])
def heatmap():
    # print(populartimes.get_id("AIzaSyDf_VkuxitxTpHvue5pxD4COY92PUMqrIM", "ChIJSYuuSx9awokRyrrOFTGg0GY"))
    # populartimes.get("AIzaSyDf_VkuxitxTpHvue5pxD4COY92PUMqrIM", [], (48.132986, 11.566126), (48.142199, 11.580047))
    data = request.json
    print(data['sLongitude'])
    return "lol"



if __name__ == '__main__':
    app.run()

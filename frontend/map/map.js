var map, trafficHeatmap, busynessHeatmap;

const TRAFFIC_ENDPOINT = "http://api.busymap.xyz:8081/traffic/";
const PLACE_BUSYNESS_ENDPOINT = "http://api.busymap.xyz:8081/placebusyness/";
const BUSYNESS_ENDPOINT = "http://api.busymap.xyz:8081/busyness/";

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 43.6532,
      lng: -79.3832
    },
    zoom: 13,
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ],
          zoomControl: true,
          mapTypeControl: false,
          mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.LEFT_TOP
          },
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false
  });

  trafficHeatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map
  });

  busynessHeatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map
  });

  map.addListener("zoom_changed", function() {
    console.log("Zoom changed")
    var bounds = map.getBounds();
    latNE = bounds.getNorthEast().lat();
    lngNE = bounds.getNorthEast().lng();
    latSW = bounds.getSouthWest().lat();
    lngSW = bounds.getSouthWest().lng();
    retrieveDataTraffic(latSW, lngSW, latNE, lngNE);
    retrieveDataBusyness(latSW, lngSW, latNE, lngNE);
  });

  map.addListener("dragend", function() {
    console.log("drag changed")
    var bounds = map.getBounds();
    latNE = bounds.getNorthEast().lat();
    lngNE = bounds.getNorthEast().lng();
    latSW = bounds.getSouthWest().lat();
    lngSW = bounds.getSouthWest().lng();
    retrieveDataTraffic(latSW, lngSW, latNE, lngNE);
    retrieveDataBusyness(latSW, lngSW, latNE, lngNE);
  });

  rangeSlider = document.getElementById('range');
  rangeSlider.addEventListener('input', function () {
    console.log("Range slider change")
    var bounds = map.getBounds();
    latNE = bounds.getNorthEast().lat();
    lngNE = bounds.getNorthEast().lng();
    latSW = bounds.getSouthWest().lat();
    lngSW = bounds.getSouthWest().lng();
    retrieveDataTraffic(latSW, lngSW, latNE, lngNE);
    retrieveDataBusyness(latSW, lngSW, latNE, lngNE);
  }, false);

  changeRadius(0.5);
  changeBusynessGradient();

  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map); // Specify just the place data fields that you need.

  autocomplete.setFields(["place_id", "geometry", "name"]);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  console.log('Hello');
  const marker = new google.maps.Marker({
    map: map
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
    console.log("Clicked button");
  });
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      console.log("Logging geometry viewport" + place.geometry.viewport);
      console.log(place.geometry.viewport);

      retrieveDataTraffic(place.geometry.viewport.Za.i, place.geometry.viewport.Va.i, place.geometry.viewport.Za.j, place.geometry.viewport.Va.j);
      retrieveDataBusyness(place.geometry.viewport.Za.i, place.geometry.viewport.Va.i, place.geometry.viewport.Za.j, place.geometry.viewport.Va.j);
    }
    else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    };

    console.log("Logging geometry location" + place.geometry.location);
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    console.log("Logging location" + location);
    marker.setVisible(true);

    let busynessData = {
      "placeID": place.place_id,
      "dayOfWeek": "Monday"
    };

    let callbackFunction = function (s) {
      console.log("Place Busyness data:");
      console.log(s);

      let json = JSON.parse(s);
      if (json.response) {
        console.log(json.response);
      }
      
      // OPEN WINDOW
      infowindowContent.setAttribute('data-place', JSON.stringify(place));
      infowindowContent.children.namedItem("busyness").setAttribute("data-busyness", JSON.stringify(json.percentage));
      infowindowContent.children.namedItem("busyness").setAttribute("data-time", JSON.stringify(getTime()));
      infowindowContent.children.namedItem("place-name").textContent = place.name;
      infowindowContent.children.namedItem("place-address").textContent = place.formatted_address;
      infowindow.open(map, marker);

      $(infowindowContent).trigger('data-attribute-changed');
    };

    sendPOST(PLACE_BUSYNESS_ENDPOINT, {
      "placeID": place.place_id,
      "dayOfWeek": "Monday"
    }, callbackFunction)
  });

}

function toggleTrafficHeatmap() {
  console.log("Toggling traffic heat map");
  trafficHeatmap.setMap(trafficHeatmap.getMap() ? null : map);
}
function toggleBusynessHeatmap() {
  console.log("Toggling busyness heat map");
  busynessHeatmap.setMap(busynessHeatmap.getMap() ? null : map);
}
function changeTrafficOpacity() {
  console.log("Changing traffic opacity");
  trafficHeatmap.set("opacity", trafficHeatmap.get("opacity") ? null : 0.2);
}

function changeBusynessOpacity() {
  console.log("Changing busyness opacity");
  busynessHeatmap.set("opacity", busynessHeatmap.get("opacity") ? null : 0.2);
}

function changeBusynessGradient() {
  console.log("Changing busyness gradient");
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)"
  ];
  busynessHeatmap.set("gradient", busynessHeatmap.get("gradient") ? null : gradient);
}

function changeRadius(viewportDelta) {
  //calculatedRadius = 0.7 / viewportDelta;
  //console.log("calculated radius: " + calculatedRadius);
  //busynessHeatmap.set("radius", calculatedRadius);
  //trafficHeatmap.set("radius", calculatedRadius);

  if (viewportDelta < 0.01) {
    console.log("Radius busyness: 50, traffic: 25, delta: " + viewportDelta);
    busynessHeatmap.set("radius", 40);
    trafficHeatmap.set("radius", 40);
  } else if (viewportDelta > 0.1) {
    console.log("Radius busyness: 0, traffic: 1, delta: " + viewportDelta);
    busynessHeatmap.set("radius", 5);
    trafficHeatmap.set("radius", 5);
  } else {
    console.log("Radius busyness: 10, traffic: 5, delta: " + viewportDelta);
    busynessHeatmap.set("radius", 15);
    trafficHeatmap.set("radius", 15);
  }
}

function retrieveDataTraffic(swLatitude, swLongitude, neLatitude, neLongitude) {

  let callbackFunctionTraffic = function (s) {
    var parsed = JSON.parse(s);
    console.log("Length Traffic Data:" + parsed.length);
    trafficHeatmap.setData(convertToMapObjectsTraffic(parsed));
  };

  sendPOST(TRAFFIC_ENDPOINT, {
    "swLatitude": swLatitude,
    "swLongitude": swLongitude,
    "neLatitude": neLatitude,
    "neLongitude": neLongitude,
    "hourOfDay": getTime()
  }, callbackFunctionTraffic)
}

function retrieveDataBusyness(swLatitude, swLongitude, neLatitude, neLongitude) {

  let callbackFunctionBusyness = function (s) {
    var parsed = JSON.parse(s);
    console.log("Length Busyness Data:" + parsed.length);
    busynessHeatmap.setData(convertToMapObjectsBusyness(parsed));
    changeRadius(neLatitude - swLatitude);
  };

  sendPOST(BUSYNESS_ENDPOINT, {
    "swLatitude": swLatitude,
    "swLongitude": swLongitude,
    "neLatitude": neLatitude,
    "neLongitude": neLongitude,
    "hourOfDay": getTime()
  }, callbackFunctionBusyness)
}

function sendPOST(path, dataDict, onResponseCallback){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", path, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          onResponseCallback(xhr.responseText)
      }
  };
  let data = JSON.stringify(dataDict);
  xhr.send(data);
}

function convertToMapObjectsBusyness(data) {
  var len = data.length;
  var latLngArray = [];
  for (var i = 0; i < len; i++) {
    coord = {location: new google.maps.LatLng(data[i]["latitude"], data[i]["longitude"]), weight: data[i]["percentage"] * 1000}
    latLngArray.push(coord);

  }
  return latLngArray;
}

function convertToMapObjectsTraffic(data) {
  var len = data.length;
  var latLngArray = [];
  for (var i = 0; i < len; i++) {
    coord = {location: new google.maps.LatLng(data[i]["latitude"], data[i]["longitude"]), weight: data[i]["percentage"]* 100}
    latLngArray.push(coord);

  }
  return latLngArray;
}

function getTime() {
  return document.getElementById('range').firstElementChild.value - 1;
}

function getDay(){
  return document.querySelector('#day-buttons .selected').id;
}

function button_active(id){
  let x=document.querySelectorAll('.day-btn');
  let len=x.length
  for ( let i=0 ;i<len; i++){
    x[i].classList.remove("selected");
    if(x[i].innerHTML===id){
      x[i].classList.add("selected");
      dayName=x[i].innerHTML;
    }
  }

  $(document).trigger('date-changed');
}

  


// Load in geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(url,function(data) {
     
    features(data.features)

});

function radius(magnitude){
    return 3*magnitude^1.5;
}

function color(magnitude){

    if (magnitude > 7) {
        return '#00008B'
    }

    else if (magnitude > 6) {
        return '#0000FF'
    }

    else if (magnitude > 5) {
        return '#6495ED'
    }

    else if (magnitude > 0) { 
        return '#87CEFA'
    }
}


function on(features, layer) {
    layer.bindPopup("<h3 align='center'>" + features.properties.place +
        "</h3><hr><p><u>Occurrence:</u> " + new Date(features.properties.time) + "</p>" +
        "</h3><p><u>Magnitude:</u> " + features.properties.mag + "</p>");
}

function features(eqData) {

  var earthquakes = L.geoJSON(eqData, {
          on: on,
          pointToLayer: function (features, latlng) {
          var markerSettings = {
          radius: radius(features.properties.mag),
          fillColor: color(features.properties.mag),
          fillOpacity: 0.5,
          opacity: .5
          };
          return L.circleMarker(latlng, markerSettings);
      }
  });
    
  createMap(earthquakes);
}


function createMap(earthquakes) {

  var map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      accessToken: API_KEY
  });
 
 var map = L.map("map", {
      center: [40, -100],
      zoom: 4,
      layers: [map,earthquakes]
  });

  var key = L.control({position: 'topright'});
  
  key.onAdd = function (map) {    
    var div = L.DomUtil.create('div', 'info legend'),
    ticks = [0, 5, 6,7];
    labels = [];
    

    div.innerHTML+=''

    for (var i = 0; i < ticks.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(ticks[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            ticks[i] + (ticks[i + 1] ? '-' + ticks[i + 1] + '<br>' : '+');
  }
    
    return div;
  };
    
  key.addTo(map);
}


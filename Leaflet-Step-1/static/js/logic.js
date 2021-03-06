// Data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Funtion of marker size
function markerSize(magnitude) {
    return magnitude * 4;
};

var earthquake = new L.LayerGroup();
//// Retrieve the data
d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
    createMap(earthquake);
});
// define the color function to assign the color to different maginitude
function Color(magnitude) {
    if (magnitude > 5) {
        return "red"
    } else if (magnitude > 4) {
        return "yellow"
    } else if (magnitude > 3) {
        return "blue"
    } else if (magnitude > 2) {
        return "magenta"
    } else if (magnitude > 1) {
        return "aqua"
    } else {
        return "purple"
    }
};
// define the create map function
function createMap() {
   
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });


    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,
          
    };

    var overlays = {
        "Earthquakes": earthquake,
        
    };

    var mymap = L.map('map', {
        center: [34.0522, -118.2437],
        zoom: 4,
        layers: [satellite, earthquake]
    });

    L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(mymap);
 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: purple"></i><span>0 - 1</span><br>';
        div.innerHTML += '<i style="background: aqua"></i><span>1 - 2</span><br>';
        div.innerHTML += '<i style="background: magenta"></i><span>2 - 3</span><br>';
        div.innerHTML += '<i style="background: blue"></i><span>3 - 4</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>4 - 5</span><br>';
        div.innerHTML += '<i style="background: red"></i><span>> 5</span><br>';  
      
        return div;
      }
    legend.addTo(mymap);


}
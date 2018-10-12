mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zZXZpY3RvciIsImEiOiJjam41ODM5dm4wMWxsM3BveGY1b3VpbzB5In0.HGKdeoRnogQrpzHqH89HTg';

var points = {
  'T01': { 'name': 'T01', 'coordinates': [-35.7117682,-9.6619995] },
  'T02': { 'name': 'T02', 'coordinates': [-35.7112983,-9.6611373] },
  'T03': { 'name': 'T03', 'coordinates': [-35.7033479,-9.6538901] },
  'T04': { 'name': 'T04', 'coordinates': [-35.7104814,-9.6460927] },
  'T05': { 'name': 'T05', 'coordinates': [-35.702694,-9.654060] },
  'T06': { 'name': 'T06', 'coordinates': [-35.7119647,-9.646838] },
  'T07': { 'name': 'T07', 'coordinates': [-35.7112983,-9.6611373] },
  'T08': { 'name': 'T08', 'coordinates': [-35.7068843,-9.6590918] },
  'T09': { 'name': 'T09', 'coordinates': [-35.7032791,-9.6472683] },
  'T10': { 'name': 'T10', 'coordinates': [-35.7032791,-9.6472683] },
  'T11': { 'name': 'T11', 'coordinates': [-35.753648,-9.544454] },
  'T12': { 'name': 'T12', 'coordinates': [-35.7095595,-9.649444] },
  'T13': { 'name': 'T13', 'coordinates': [-35.7278794,-9.6142866] },
  'T14': { 'name': 'T14', 'coordinates': [-35.6995323,-9.6297669] },
}

var map = new mapboxgl.Map({
  container: 'map',
  center: [-35.7171652,-9.6495804],
  zoom: 12,
  style: 'mapbox://styles/mapbox/streets-v9'
});


// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'points', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'points', function () {
    map.getCanvas().style.cursor = '';
});

// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'points', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var properties = e.features[0].properties;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML("<a href='#" + properties.name + "' class='popup-link'>" + properties.name + "</a>")
        .addTo(map);
});

map.on('load', function() {
    map.loadImage('./pin.png', function(error, image) {
        if (error) throw error;
        map.addImage('pin', image);

        var features = Object.keys(points).map(function(point) {
            return {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": points[point].coordinates
                },
                "properties": {
                    "name": points[point].name
                }
            }
        })

        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": features
                }
            },
            "layout": {
                'icon-allow-overlap': true,
                "icon-image": "pin",
                "icon-size": 0.15
            }
        });
    });
});

function onHash(hash) {
  var hash = location.hash.split('#')[1]
  if (hash === undefined) {
    document.querySelector('#popup-wrapper').style.display = 'none';
    return;
  }

  var popupHtml =
    '<a id="close-button" href="#"></a>' +
    '<h1 align="center">' + points[hash].name + '</h1>' +
    '<p><img src="./images/' + hash + '/image1.png" /></p>' +
    '<hr>' +
    '<p><img src="./images/' + hash + '/image2.png" /></p>' +
    '<p align="center">Diurno</p>' +
    '<hr>' +
    '<p><img src="./images/' + hash + '/image3.png" /></p>' +
    '<p align="center">Noturno</p>';

  var popup = document.querySelector('#popup');
  popup.innerHTML = popupHtml;

  document.querySelector('#popup-wrapper').style.display = 'block';
}

window.addEventListener("hashchange", onHash, false);
if (window.location.hash) {
  onHash(window.location.hash)
}

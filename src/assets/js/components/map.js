"use strict";


const BOUNDS_MAP = {
    _northEast: {
        lat: 53.143475584594526,
        lng: -1.5106201171875
    },
    _southWest: {
        lat: 51.78483389373529,
        lng: -2.5405883789062504
    }
}

function initMap() {
    const map = L.map('map', {
        wheelPxPerZoomLevel: 150,
        zoom: 12,
        center: [52.468728, -2.025817]
    });

    // const world = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/streets-v11',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: 'pk.eyJ1IjoidmVyZG9tbW1lbWFuIiwiYSI6ImNraXE5YXVpZzF1YTkydnFqaWQyMmdsN2cifQ.wIoToPAN9pisl7VXknULmA'
    // });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
        minZoom: 9,

    }).addTo(map)

    const marker = L.marker([52.468728, -2.025817]).addTo(map);

    marker.bindTooltip("CENTER",).openTooltip();

    function onMapClick(e) {
        console.log("You clicked the map at " + e.latlng);
    }

    map.on('click', onMapClick);

    console.log(map.getBounds());
    const bounds = map.getBounds();
    const northEast = L.latLng(53, -1.5);
    const southWest = L.latLng(52, -2.7);
    map.setMaxBounds(L.latLngBounds(southWest, northEast));


    getTravelEndpoints().then(endpoints => {
        endpoints.forEach(endpoint => {
            const CD = endpoint.coordinate;
            L.marker(L.latLng(CD.latitude, CD.longitude)).addTo(map).bindTooltip(`${endpoint.name}`).openTooltip();

        });
    });

    const dome = L.circle([52.468728, -2.025817], {
        radius: 10000,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
    }).addTo(map);

    dome.bindPopup("This is the start dome");

    // const coords = [];
    // for (let i = 0; i < 102; i++) {
    //     const coord = getRandomCoord(dome.getBounds());
    //     coords.push(coord)
    //     L.marker(coord).addTo(map).bindTooltip(`${i}`).openTooltip();
    // }
    // console.log(coords);
    // console.log(JSON.stringify(coords));

    setToolTipRange(map, 12);
}

function getRandom(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomCoord(bounds, precision = 100000) {
    return [
        getRandom(bounds._southWest.lat * precision, bounds._northEast.lat * precision) / precision,
        getRandom(bounds._southWest.lng * precision, bounds._northEast.lng * precision) / precision
    ]
}


function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree * Math.PI / 180;
}

function setToolTipRange(map, tooltipThreshold) {
    var lastZoom;
    map.on('zoomend', function () {
        var zoom = map.getZoom();
        if (zoom < tooltipThreshold && (!lastZoom || lastZoom >= tooltipThreshold)) {
            map.eachLayer(function (l) {
                if (l.getTooltip()) {
                    var tooltip = l.getTooltip();
                    l.unbindTooltip().bindTooltip(tooltip, {
                        permanent: false
                    })
                }
            })
        } else if (zoom >= tooltipThreshold && (!lastZoom || lastZoom < tooltipThreshold)) {
            map.eachLayer(function (l) {
                if (l.getTooltip()) {
                    var tooltip = l.getTooltip();
                    l.unbindTooltip().bindTooltip(tooltip, {
                        permanent: true
                    })
                }
            });
        }
        lastZoom = zoom;
    })
}

import React from 'react';
import L from 'leaflet';


/**
 * get list of coordinates for the shortest route
 * @param {[float,float]} start 
 * @param {[float,float]} end
 */
function getRoute(start, end){
    var url = 'http://router.project-osrm.org/route/v1/driving/'
    url = url + start[0].toString() + ' ' + start[1].toString();
    url = url + end[2].toString() + ' ' + end[3].toString();
    url = url + '?geometries=geojson&overview=true'

    return fetch(url)
    .then(async response => {
        const data = await response.json();
    })
    .then(result => {
        for (const [index, value] of result.entries()) {
            
        }
        console.log(result);
    })
    .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('Error: ', error);
    });
}

/**
 * get list of elevations for list of coordinates and return the total change in elevation
 * @param {string} route [[lat,lng],[lat,lng], ...]
 */
function getElevationRoute(route){
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOpt = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(route),
        redirect:'follow',
    };

    var total = 0.0;

    return fetch('https://elevation.racemap.com/api', requestOpt)
    .then(async response => response.text())
    .then(result => {
        for (const [index, value] of result.entries()) {
            total += value.value;
        };
        console.log(total);
    })
    .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('Error: ', error);
    });
}

/**
 * get elevation at single coordinate
 * @param {float} lat Latitude
 * @param {float} lng Longitude
 */
function getElevationCoordinate(lat,lng){
    const url = 'https://elevation.racemap.com/api/?lat='.concat(lat.toString()).concat('&lng=').concat(lng.toString());
    return fetch(url)
    .then(response => response.text())
    .then(result => {
        console.log(result);
    });
    
}

export default getRoute;
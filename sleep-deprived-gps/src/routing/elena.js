import { execSync } from 'child_process';

// var route;
// var distance;
// var duration;

/**
 * Runs a command from two coordinates 
 * @params {[float,float],[float,float]} start=[lat,long], end=[lat,long]
 * @runs cmd 'python3 elena.py lat long lat long'
 * @return {string} list of coordinates as a string
 */

function runCommand(start, end){
    var cmd = 'python3 elena.py ';
    //cmd = cmd + start[0].toString() + ' ' + start[1].toString();
    //cmd = cmd + end[2].toString() + ' ' + end[3].toString();

    cmd.concat(start[0].toString()).concat(' ').concat(start[1].toString()).concat(end[2].toString()).concat(' ').concat(end[3].toString());

    //const execSync = require('child_process');

    execSync(cmd, {encoding: 'utf8'});

    var file = document.getElementById('route.txt');
    var route = parseCoordinates(file);

    return ( route );
}

/**
 * 
 * @param {string} coordinates 
 * @returns {[[float,float],[float,float]]} coordinates as an array
 */
function parseCoordinates(coordinates){
    var c = coordinates.slice(1).slice(0, -1).split(",")

    var coor = c.map(Number)

    return coor;
}

export default runCommand;
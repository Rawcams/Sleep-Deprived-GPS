import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@mui/material';

import './App.css'
import SearchBox from './SearchBox';
import routeFile from './routing/route.txt'

import getRoute from './routing/Routing.jsx';

const center = [42.360081, -71.058884];
const zoom = 13
var marker;

//Move map to detected location and set marker there
//TODO: Change to a button
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    });

    const onClick = useCallback(() => {
        map.setView(position, zoom)
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                You are here
            </Popup>
        </Marker>
    );
}


// Display route from start to end on map using waypoints
// TODO: DISPLAY WAYPOINTS AT EACH COORDINATE
function DisplayRoute(props) {
    const { start, setStart, dest, setDest } = props;


    // [[lat, lng],[lat, lng]]
    return (
        <Button 
            variant='outlined'
            onClick={() => {
                fetch(routeFile)
                    .then(r => r.text())
                    .then((text) => {
                        console.log(text);
                        var points = text.replace('[', '').replace('[', '').replace('[', '').replace(']', '').replace(']', '').replace(']', '').split(',');
                        console.log('points: ', points)
                        points = points.map(Number);
                        setStart([points[0], points[1]]);
                        setDest([points[2], points[3]]);
                    });
            }}
        >
            Routing
        </Button>
    );
    

    //var coor = [[13.5,15.6],[13.5,15.7]];
    // const [route, setRoute] = useState(() => getRoute([42.532493, -71.111371],[42.45834, -71.127736]));
    // // getRoute(position.lat,position.lng)
    // // L.Routing.control({
    // //     waypoints: route,
    // //     autoRoute: true,
    // //     routeWhileDragging: true,
    // // }).addTo(map);

    // var control = L.Routing.control({
    //     "type": "LineString",
    //     waypoints: [
    //        L.latLng(42.532493, -71.111371),
    //        L.latLng(42.45834, -71.127736)
    //     ],
    //     lineOptions : {
    //        styles: [
    //           {color: 'black', opacity: 0.15, weight: 9}, 
    //           {color: 'white', opacity: 0.8, weight: 6}, 
    //           {color: 'red', opacity: 1, weight: 2}
    //        ],
    //        missingRouteStyles: [
    //           {color: 'black', opacity: 0.5, weight: 7},
    //           {color: 'white', opacity: 0.6, weight: 4},
    //           {color: 'gray', opacity: 0.8, weight: 2, dashArray: '7,12'}
    //        ]
    //     },
     
    //     show: true,
    //     addWaypoints: true,
    //     autoRoute: true,
    //     routeWhileDragging: true,
    //     draggableWaypoints: false,
    //     useZoomParameter: false,
    //     showAlternatives: true,
    //     });

    //     return route === null ? null : (
    //         <DisplayRoute map={map}/>
    //     );
}

//Displays the latitude and longitude of mouse clicked area
function DisplayPosition({map}) {
    const [position, setPosition] = useState(() => map.getCenter());

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
    }, [map]);

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove]);

    
    return (
        <p>
            latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
        </p>
    );
}



function App() {
    const [map, setMap] = useState(null);
    const [selectPosition, setSelectPosition] = useState(null);
    const locationSelection = [selectPosition?.lat, selectPosition?.lon];
    const [route, setRoute] = useState('');
    const [start, setStart] = useState([]);
    const [dest, setDest] = useState([]);

    // console.log("marker:" + marker);

    if (marker) {
        map.removeLayer(marker);
    }

    if (selectPosition?.lat != null && selectPosition?.lon != null) {
        marker = new L.marker([selectPosition?.lat, selectPosition?.lon]);
        map.addLayer(marker);
        map.flyTo([selectPosition?.lat, selectPosition?.lon]);
    }

    // L.Routing.control({
    //     waypoints: [
    //         L.latLng(42.532493, -71.111371),
    //         L.latLng(42.4902237, -71.1209)
    //     ],
    //     routeWhileDragging: true
    // }).addTo(map);

    //map.addLayer(DisplayRoute(map));
    //DisplayRoute(map).addTo(map);


    
    //const dest = [points[2], points[3]];

    console.log('start: ', start);
    console.log('dest: ', dest)

    const displayMap = useMemo(
        () => (
            <MapContainer 
                center={center}
                zoom={zoom}
                ref={setMap}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectPosition && (
                    <Marker position={locationSelection}>
                        <Popup>
                            Text
                        </Popup>
                    </Marker>
                )}
                {(start.length != 0) && (
                    <Marker position={start}>
                        <Popup>
                            Text
                        </Popup>
                    </Marker>
                )}
                {(dest.length != 0) && (
                    <Marker position={dest}>
                        <Popup>
                            Text
                        </Popup>
                    </Marker>
                )}
                <LocationMarker />
            </MapContainer>
        ),
        [],
    );

    return (
        <div className="map-container">
            {displayMap}
            <div className="ui-container">
                <div style={{ height: "92vh" }} >
                    <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition} route={route} setRoute={setRoute}/>
                    <DisplayRoute start={start} setStart={setStart} dest={dest} setDest={setDest} />
                </div>
                {map ? <DisplayPosition map={map} /> : null}
            </div>
        </div>
    );
}

export default App
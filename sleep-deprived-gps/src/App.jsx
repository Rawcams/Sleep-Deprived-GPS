import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import './App.css'
import SearchBox from './SearchBox';


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

    console.log("marker:" + marker);

    if (marker) {
        map.removeLayer(marker);
    }

    if (selectPosition?.lat != null && selectPosition?.lon != null) {
        marker = new L.marker([selectPosition?.lat, selectPosition?.lon]);
        map.addLayer(marker);
        map.flyTo([selectPosition?.lat, selectPosition?.lon]);
    }
    

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
                    <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition} />
                </div>
                {map ? <DisplayPosition map={map} /> : null}
            </div>
        </div>
    );
}

export default App
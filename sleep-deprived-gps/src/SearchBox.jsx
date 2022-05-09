import React, { useState } from "react";
import L from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { TextField } from "@mui/material";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Scrollbars } from 'react-custom-scrollbars';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
    q: '',
    format: 'json',
    addressdetails: 'addressdetails',
};

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                You are here
            </Popup>
        </Marker>
    );
}

function SearchBox(props) {
    const { selectPosition, setSelectPosition } = props;
    const [searchText, setSearchText] = useState("");
    const [searchText2, setSearchText2] = useState("");
    const [listPlace, setListPlace] = useState([]);

    return (
        <div className="searchbox-container">
            <div style={{ padding: "8px" }}>
                <TextField
                    style={{ width: "100%" }}
                    id="start-location"
                    label="Start Location"
                    variants="outlined"
                    size="small"
                    color="primary"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if(e.keyCode == 13) {
                            e.preventDefault();
                            const params = {
                                q: searchText,
                                format: 'json',
                                addressdetails: 1,
                                polygon_geojson: 0,
                            };
                            const queryString = new URLSearchParams(params).toString();
                            const requestOptions = {
                                method: "GET",
                                redirect: "follow",
                            };
                            fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                                .then((response) => response.text())
                                .then((result) => {
                                    console.log(JSON.parse(result));
                                    setListPlace(JSON.parse(result));
                                })
                                .catch((err) => console.log("err: ", err));
                        }
                    }}
                />
            </div>
            <div style={{ padding: "8px" }}>
                <TextField
                    style={{ width: "100%" }}
                    id="destination"
                    label="Destination"
                    variants="outlined"
                    size="small"
                    color="secondary"
                    value={searchText2}
                    onChange={(e) => {
                        setSearchText2(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if(e.keyCode == 13) {
                            e.preventDefault();
                            const params = {
                                q: searchText2,
                                format: 'json',
                                addressdetails: 1,
                                polygon_geojson: 0,
                            };
                            const queryString = new URLSearchParams(params).toString();
                            const requestOptions = {
                                method: "GET",
                                redirect: "follow",
                            };
                            fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                                .then((response) => response.text())
                                .then((result) => {
                                    console.log(JSON.parse(result));
                                    setListPlace(JSON.parse(result));
                                })
                                .catch((err) => console.log("err: ", err));
                        }
                    }}
                />
            </div>
            <List component="nav" aria-label="main mailbox folders" style={{ height: "69vh", overflow: "hidden" }}>
                <Scrollbars autoHide>
                    <ListItem button onClick={() => {
                        return (
                            <LocationMarker />
                        );
                    }}>
                        <ListItemIcon>
                            <MyLocationIcon />
                        </ListItemIcon>
                        <ListItemText primary="Current Location" />
                    </ListItem>
                    <Divider />
                    {listPlace.map((item) => {
                        return (
                            <div key={item?.osm_id}>
                                <ListItem button onClick={() => {
                                    setSelectPosition(item);
                                }}>
                                    <ListItemIcon>
                                        <LocationOnIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item?.display_name} />
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </Scrollbars>
            </List>
        </div>
    );
}

export default SearchBox;
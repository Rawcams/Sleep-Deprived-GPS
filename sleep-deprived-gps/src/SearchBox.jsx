import React, { useState } from "react";
import L from 'leaflet';
import { TextField } from "@mui/material";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Scrollbars } from 'react-custom-scrollbars';

//import runCommand from './elena.js'
import getRoute from './routing/Routing.jsx';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
    q: '',
    format: 'json',
    addressdetails: 'addressdetails',
};


function SearchBox(props) {
    const { selectPosition, setSelectPosition, route, setRoute } = props;
    const [searchText, setSearchText] = useState("");
    const [searchText2, setSearchText2] = useState("");
    const [listPlace, setListPlace] = useState([]);
    //const { route, setRoute } = props;

    return (
        <div className="searchbox-container">
            <div style={{ padding: "8px" }}>
                <TextField
                    style={{ width: "100%" }}
                    id="outlined-basic"
                    label="Start Location"
                    variants="outlined"
                    size="small"
                    color="primary" focused
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
                    id="outlined-basic"
                    label="End Location"
                    variants="outlined"
                    size="small"
                    color="secondary" focused
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
                            var url = 'http://router.project-osrm.org/route/v1/driving/'.concat(searchText.toString()).concat(";").concat(searchText2.toString()).concat('?geometries=geojson&overview=full');
                            Promise.all([
                                fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions),
                                fetch(url)
                            ])
                                .then((response) => response.text())
                                .then(([result, coor]) => {
                                    console.log(JSON.parse(result));
                                    setListPlace(JSON.parse(result));
                                    //var r = getRoute([parseFloat(searchText.split(',')[0]),parseFloat(searchText.split(',')[1])],[parseFloat(searchText2.split(',')[0]),parseFloat(searchText2.split(',')[0])]);
                                    coor = coor.split("[[")[1].split("]]")[0].slice(1).slice(0, -1).split("],[");
                                    setRoute(coor);
                                })
                                .catch((err) => console.log("err: ", err));
                        }
                    }}
                />
            </div>
            <List component="nav" aria-label="main mailbox folders" style={{ height: "76vh", overflow: "hidden" }}>
                <Scrollbars autoHide>
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
import React, { useState, useEffect } from "react";
import "./location.scss";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { Button, Spin } from "antd";

const Location = ({ onGenerateRoute, distance, time }) => {
  const [locations, setLocations] = useState([
    { id: 1, type: "origin", value: null },
    { id: 2, type: "destination", value: null },
  ]);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);

  const handleAddWaypoint = () => {
    const newId = locations.length + 1;
    const newWaypoint = { id: newId, type: "waypoint", value: null };
    const destinationIndex = locations.findIndex(
      (loc) => loc.type === "destination"
    );
    const updatedLocations = [
      ...locations.slice(0, destinationIndex),
      newWaypoint,
      ...locations.slice(destinationIndex),
    ];
    setLocations(updatedLocations);
  };

  const handleRemoveWaypoint = (id) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
  };

  const handleChangeLocation = (id, value) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, value } : loc
    );
    setLocations(updatedLocations);
    setRouteCalculated(false);
  };

  const handleGenerateRoute = async () => {
    const validLocations = locations.filter((loc) => loc.value !== null);

    if (validLocations.length < 2) {
      console.error("Please select at least source and destination.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onGenerateRoute(validLocations);
      setRouteCalculated(true);
      setLoading(false);
      setLoadingFooter(true);

      setTimeout(() => {
        setLoadingFooter(false);
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    setRouteCalculated(false);
  }, [locations]);

  const firstLocation =
    locations[0]?.value?.properties?.address_line1 ?? "Unknown";
  const lastLocation =
    locations[locations.length - 1]?.value?.properties?.address_line1 ?? "Unknown";

  const showFooter = routeCalculated && distance !== null && time !== null;
  
  const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  const buttonStyle = {
    backgroundColor: '#1B31A8',
    color: 'white',
    border: 'none',
  };
 

  return (
    <GeoapifyContext apiKey={apiKey}>
      <div className="container">
        <div className="input">
          <label className="input-label">Origin</label>
          {locations.map((loc, index) => (
            <div key={loc.id}>
              {loc.type === "origin" && (
                <div className="field">
                  <GeoapifyGeocoderAutocomplete
                    placeholder={`Enter ${loc.type} address here`}
                    placeSelect={(value) => handleChangeLocation(loc.id, value)}
                  />
                </div>
              )}
              {loc.type === "waypoint" && (
                <div className="field waypoint-field">
                  <GeoapifyGeocoderAutocomplete
                    className="waypoint-input"
                    placeholder={`Enter ${loc.type} address here`}
                    placeSelect={(value) => handleChangeLocation(loc.id, value)}
                  />
                  <Button className="waypoint-button" onClick={() => handleRemoveWaypoint(loc.id)} danger>
                    X
                  </Button>
                </div>
              )}
              {index === locations.length - 1 && loc.type === "destination" && (
                <div className="add-waypoint-container">
                  <button className="add-waypoint" onClick={handleAddWaypoint}>
                    +
                  </button>
                  <span>Add another stop</span>
                </div>
              )}
              {loc.type === "destination" && (
                <div>
                  <label className="input-label">Destination</label>
                  <div className="field">
                    <GeoapifyGeocoderAutocomplete
                      placeholder={`Enter ${loc.type} address here`}
                      placeSelect={(value) => handleChangeLocation(loc.id, value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="button">
          <Button
            style={buttonStyle}
            className="calculate"
            type="primary"
            onClick={handleGenerateRoute}
            disabled={loading}
          >
            {loading ? <Spin /> : "Calculate"}
          </Button>
        </div>
      </div>
      {showFooter && (
        <div className="metrics">
          {distance !== null && time !== null && !loadingFooter && (
            <div>
              <div className="distance">
                <span>
                  <b>Distance:</b>
                </span>
                <span>{Math.round(distance / 1000).toLocaleString()} kms</span>
              </div>
              <div className="estimated-time">
                <span>
                  <b>Estimated Time:</b>
                </span>
                <span>{Math.round(time / 3600).toLocaleString()} hours</span>
              </div>
            </div>
          )}
          {loadingFooter && (
            <div className="loading-footer">
              <Spin size="small" /> Fetching updated data...
            </div>
          )}
        </div>
      )}
      {showFooter && !loadingFooter && (
        <div className="footer">
          <p>
            The distance between <b>{firstLocation}</b> and <b>{lastLocation}</b>{" "}
            via selected route is{" "}
            <b>{Math.round(distance / 1000).toLocaleString()} kms</b> and time is{" "}
            <b>{Math.round(time / 3600).toLocaleString()} hrs</b>
          </p>
        </div>
      )}
    </GeoapifyContext>
  );
};

export default Location;

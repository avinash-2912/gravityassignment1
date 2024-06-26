import React, { useState } from "react";
import './HomePage.scss';
import Location from "./Location";
import MapComponent from "./MapComponent";
import axios from "axios";

const HomePage = () => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  const handleGenerateRoute = async (locations) => {
    const waypoints = locations.map((loc) => `${loc.value.properties.lat},${loc.value.properties.lon}`).join("|");
    const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
    const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      console.log(response);
      const routeResult = response.data;
      console.log("Route Result:", routeResult);
      setRoute(routeResult);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <div className="homePage">
      <p>Let's calculate <b>distance</b> from Google maps </p>
      <div className="container">
        <div className="locationContainer">
          <Location
            onGenerateRoute={handleGenerateRoute}
            time={time}
            distance={distance}
          />
        </div>
        <div className="mapContainer">
          <MapComponent 
            route={route}
            setDistance={setDistance}
            setTime={setTime} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

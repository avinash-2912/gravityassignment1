import React, { useEffect } from "react";
import './map.scss'
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const RouteLayer = ({ route,setDistance,setTime}) => {
  const map = useMap();
  const turnByTurnMarkerStyle = {
    radius: 5,
    fillColor: "#fff",
    color: "#555",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
  };

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.LayerGroup) {
        map.removeLayer(layer);
        setDistance(0);
        setTime(0);
      }
    });
    const geoJsonLayer = L.geoJSON(route, {
      style: () => ({
        color: "rgba(20, 137, 255, 0.7)",
        weight: 5,
      }),
    })
      .bindPopup((layer) => {
        return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
      })
      .addTo(map);
    map.fitBounds(geoJsonLayer.getBounds());

    const turnByTurns = [];
    route.features.forEach((feature) =>
      feature.properties.legs.forEach((leg, legIndex) =>
        leg.steps.forEach((step) => {
          const pointFeature = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates:
                feature.geometry.coordinates[legIndex][step.from_index],
            },
            properties: {
              instruction: step.instruction.text,
            },
          };
          turnByTurns.push(pointFeature);
        })
      )
    );

    setDistance(route.features[0].properties.distance);
    setTime(route.features[0].properties.time);

    L.geoJSON(
      {
        type: "FeatureCollection",
        features: turnByTurns,
      },
      {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, turnByTurnMarkerStyle);
        },
      }
    )
      .bindPopup((layer) => {
        return `${layer.feature.properties.instruction}`;
      })
      .addTo(map);
  }, [route,map,setDistance,setTime,turnByTurnMarkerStyle]);

  return null;
};

const MapComponent = ({ route ,setDistance,setTime}) => {
  return (
    <MapContainer
      className="map"
      center={[25.6093239,85.1235252]}
      zoom={6}
      scrollWheelZoom={true}
      //style={{ height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route && <RouteLayer route={route} 
      setDistance={setDistance}
      setTime={setTime} />
      }
    </MapContainer>
  );
};

export default MapComponent;

import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import PropTypes from "prop-types";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

ChangeCenter.propTypes = {
  position: PropTypes.array,
};
function Map() {
  const [mapPosition, setMapPosition] = useState([23.253771, 77.433882]);
  const { cities } = useCities();
  const [mapLat, mapLng] = useUrlPosition();
  const {
    getPosition,
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocationPosition)
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading" : "Use your Position"}
        </Button>
      )}
      <h1>
        {mapLat} {mapLng}
      </h1>
      <MapContainer
        center={mapPosition}
        zoom={15}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span> {city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <button onClick={() => setMapPosition([51.505, -0.09])}>
          Go to London
        </button>
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap(); //Current instance of the map being displayed
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate(); // This will return a function that we can use to navigate to different routes programmatically

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;

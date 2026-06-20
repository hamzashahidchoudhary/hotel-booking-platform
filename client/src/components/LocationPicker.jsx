import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click: (e) => onPick([e.latlng.lng, e.latlng.lat]),
  });
  return null;
};

// coordinates is [lng, lat] (GeoJSON order) to match the backend schema
const LocationPicker = ({ coordinates, onChange }) => {
  const center = coordinates ? [coordinates[1], coordinates[0]] : [40, -95];

  return (
    <div className="h-64 overflow-hidden rounded-xl border border-ink/15">
      <MapContainer center={center} zoom={coordinates ? 12 : 3} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onChange} />
        {coordinates && <Marker position={[coordinates[1], coordinates[0]]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;

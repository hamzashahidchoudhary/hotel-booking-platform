import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

// Default Leaflet marker icons reference image paths that don't resolve correctly
// under bundlers like Vite, so we rebuild the icon manually from CDN URLs.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SearchMap = ({ properties = [], center = [20, 0], zoom = 2 }) => {
  const navigate = useNavigate();

  const validProperties = properties.filter(
    (p) => p.location?.coordinates?.coordinates?.length === 2
  );

  const mapCenter =
    validProperties.length > 0
      ? [
          validProperties[0].location.coordinates.coordinates[1],
          validProperties[0].location.coordinates.coordinates[0],
        ]
      : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={validProperties.length > 0 ? 11 : zoom}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validProperties.map((property) => {
        const [lng, lat] = property.location.coordinates.coordinates;
        return (
          <Marker key={property._id} position={[lat, lng]} icon={markerIcon}>
            <Popup>
              <div className="w-44 cursor-pointer" onClick={() => navigate(`/properties/${property._id}`)}>
                <img
                  src={property.images?.[0]?.url}
                  alt={property.title}
                  className="mb-2 h-20 w-full rounded object-cover"
                />
                <p className="text-sm font-medium leading-tight">{property.title}</p>
                <p className="text-xs text-gray-500">${property.pricePerNight} / night</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default SearchMap;

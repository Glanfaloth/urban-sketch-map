import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

const artworks = [
  {
    id: 1,
    title: 'Sketch in Paris',
    description: 'A quick sketch of the Eiffel Tower.',
    image: 'https://en.wikipedia.org/wiki/Eiffel_Tower#/media/File:Tour_Eiffel_Wikimedia_Commons_(cropped).jpg',
    position: [48.8584, 2.2945],
  },
  {
    id: 2,
    title: 'New York Street',
    description: 'Urban sketching in Manhattan.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Manhattan_Skyline_2006.jpg',
    position: [40.7128, -74.006],
  },
  {
    id: 3,
    title: 'Tokyo Temple',
    description: 'A peaceful temple in Tokyo.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Sensoji_Temple%2C_Tokyo%2C_Japan.jpg',
    position: [35.7148, 139.7967],
  },
];

// Fix default icon issue in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {artworks.map((art) => (
          <Marker key={art.id} position={art.position}>
            <Popup>
              <div style={{ maxWidth: 200 }}>
                <img src={art.image} alt={art.title} style={{ width: '100%', borderRadius: 4 }} />
                <h3>{art.title}</h3>
                <p>{art.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App; 
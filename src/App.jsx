import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix default icon issue in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch("/api/notion-artworks")
      .then(res => res.json())
      .then(data => setArtworks(data));
  }, []);

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
                <img src={art.images} alt={art.title} style={{ width: '100%', borderRadius: 4 }} />
                <h3>{art.title}</h3>
                <p>{art.description}</p>
                <p><b>Date:</b> {art.date}</p>
                <p><b>Location:</b> {art.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App; 
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
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [artworks, setArtworks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetch("/api/notion-artworks")
      .then(res => res.json())
      .then(data => setArtworks(data));
  }, []);

  // Extract unique tags (by name) with color
  const tagMap = new Map();
  artworks.forEach(art => {
    (art.tags || []).forEach(tag => {
      if (tag && tag.name && !tagMap.has(tag.name)) {
        tagMap.set(tag.name, tag);
      }
    });
  });
  const allTags = Array.from(tagMap.values());

  // Filtered artworks for gallery
  const filteredArtworks = selectedTag
    ? artworks.filter(art => (art.tags || []).some(tag => tag.name === selectedTag))
    : [];

  // Notion color to CSS color mapping (approximate)
  const notionColorMap = {
    default: '#e0e0e0',
    gray: '#e3e3e3',
    brown: '#e9d5c0',
    orange: '#ffe2b7',
    yellow: '#fff9b1',
    green: '#d3fbe1',
    blue: '#d3e5fa',
    purple: '#e6deff',
    pink: '#ffd6e7',
    red: '#ffbdbd',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Floating menu button */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1001,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 56,
            height: 56,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            cursor: 'pointer',
          }}
          aria-label="Show tags and gallery"
        >
          <span role="img" aria-label="menu">☰</span>
        </button>
      )}
      {/* Sidebar overlay */}
      {showSidebar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: 350,
            background: '#fafaff',
            borderRight: '1px solid #eee',
            boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
            zIndex: 1002,
            overflowY: 'auto',
            padding: 16,
            transition: 'transform 0.2s',
          }}
        >
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              fontSize: 24,
              color: '#888',
              cursor: 'pointer',
            }}
            aria-label="Close sidebar"
          >
            ×
          </button>
          <h2 style={{ color: '#222', marginTop: 0 }}>Tags</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {allTags.map(tag => (
              <button
                key={tag.name}
                onClick={() => setSelectedTag(tag.name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 16,
                  border: selectedTag === tag.name ? '2px solid #0077ff' : '1px solid #ccc',
                  background: notionColorMap[tag.color] || notionColorMap.default,
                  cursor: 'pointer',
                  fontWeight: selectedTag === tag.name ? 'bold' : 'normal',
                  color: '#222',
                  outline: 'none',
                }}
              >
                {tag.name}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                style={{ marginLeft: 8, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
          {selectedTag && (
            <>
              <h3>Gallery: {selectedTag}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {filteredArtworks.map(art => (
                  <div key={art.id} style={{ border: '1px solid #eee', borderRadius: 6, padding: 6, background: '#fff' }}>
                    <img src={art.images} alt={art.title} style={{ width: '100%', borderRadius: 4, marginBottom: 4 }} />
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{art.title}</div>
                  </div>
                ))}
                {filteredArtworks.length === 0 && <div style={{ gridColumn: '1 / -1', color: '#888' }}>No artworks found.</div>}
              </div>
            </>
          )}
        </div>
      )}
      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxBounds={[[-85, -180], [85, 180]]}
          style={{ height: '100%', width: '100%' }}
        >
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
                  {art.tags && art.tags.length > 0 && (
                    <p><b>Tags:</b> {art.tags.map(t => t.name).join(', ')}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App; 
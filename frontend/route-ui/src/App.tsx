import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [input, setInput] = useState("");
  const [routes, setRoutes] = useState<any>(null);

  const center: LatLngExpression = [37.7749, -122.4194]; // default center

  async function sendRequest() {
    try {
      const data = JSON.parse(input);
      const res = await fetch("https://<your-backend-render-url>/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setRoutes(json);
    } catch (e) {
      alert("Invalid JSON or failed to fetch from backend");
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "35%", padding: "15px", background: "#f5f5f5", overflowY: "scroll" }}>
        <h2>Fleet Optimizer</h2>
        <textarea
          style={{ width: "100%", height: "300px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here"
        />
        <button
          style={{ width: "100%", padding: "10px", marginTop: "10px", background: "black", color: "white", cursor: "pointer" }}
          onClick={sendRequest}
        >
          Optimize Routes
        </button>

        {routes && (
          <pre style={{ fontSize: "12px", marginTop: "20px" }}>
            {JSON.stringify(routes, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ width: "65%", height: "100%" }}>
        <MapContainer center={center} zoom={12} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {routes &&
            Object.keys(routes.routes).map((truckId) =>
              routes.routes[truckId].map((t: any, idx: number) => (
                <Marker key={truckId + "-" + idx} position={[t.location.lat, t.location.lng] as LatLngExpression}>
                  <Popup>{t.id}</Popup>
                </Marker>
              ))
            )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

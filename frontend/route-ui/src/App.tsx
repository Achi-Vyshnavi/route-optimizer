import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Example JSON
const exampleJSON = `{
  "trucks": [
    {"id": "Truck1", "capacity": 15, "start_location": {"lat": 37.7749, "lng": -122.4194}},
    {"id": "Truck2", "capacity": 12, "start_location": {"lat": 37.8044, "lng": -122.2711}},
    {"id": "Truck3", "capacity": 10, "start_location": {"lat": 37.6879, "lng": -122.4702}}
  ],
  "tasks": [
    {"id": "Task1", "location": {"lat": 37.7799, "lng": -122.4149}, "load": 5},
    {"id": "Task2", "location": {"lat": 37.7689, "lng": -122.4294}, "load": 3},
    {"id": "Task3", "location": {"lat": 37.7949, "lng": -122.3994}, "load": 4},
    {"id": "Task4", "location": {"lat": 37.8040, "lng": -122.2715}, "load": 6},
    {"id": "Task5", "location": {"lat": 37.8100, "lng": -122.2750}, "load": 3},
    {"id": "Task6", "location": {"lat": 37.6900, "lng": -122.4800}, "load": 4},
    {"id": "Task7", "location": {"lat": 37.6820, "lng": -122.4600}, "load": 5},
    {"id": "Task8", "location": {"lat": 37.7000, "lng": -122.4700}, "load": 3}
  ]
}`;

const truckColors: string[] = ["red", "blue", "green", "orange", "purple"];

function App() {
  const [input, setInput] = useState<string>("");
  const [routes, setRoutes] = useState<any>(null);

  const center: LatLngExpression = [37.7749, -122.4194];

  const loadExample = () => setInput(exampleJSON);

  const sendRequest = async () => {
    let data;
    try {
      data = JSON.parse(input.trim());
    } catch (e: any) {
      alert("Invalid JSON! " + e.message);
      return;
    }

    try {
      const res = await fetch("https://route-optimizer-4.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setRoutes(json);
    } catch (e) {
      alert("Failed to fetch backend: " + e);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Left panel */}
      <div
        style={{
          width: "35%",
          padding: "20px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          margin: "10px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Fleet Optimizer</h1>

        <button
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            background: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={loadExample}
        >
          Load Example JSON
        </button>

        <textarea
          style={{
            width: "100%",
            height: "250px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "rgba(255,255,255,0.3)",
            resize: "none",
            color: "#000",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here"
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "12px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={sendRequest}
        >
          Optimize Routes
        </button>

        {routes && (
          <pre
            style={{
              fontSize: "12px",
              marginTop: "20px",
              background: "rgba(255,255,255,0.3)",
              padding: "10px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(routes, null, 2)}
          </pre>
        )}
      </div>

      {/* Map panel */}
      <div style={{ width: "65%", height: "100%", margin: "10px", borderRadius: "15px", overflow: "hidden" }}>
        <MapContainer center={center as any} zoom={10} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Truck start markers */}
          {routes &&
            Object.keys(routes.routes).map((truckId, idx) => {
              const truckTasks = routes.routes[truckId];
              const truckStart = truckTasks[0]?.location || { lat: 37.7749, lng: -122.4194 };

              return (
                <Marker key={"truck-" + truckId} position={[truckStart.lat, truckStart.lng]}>
                  <Popup>
                    <div style={{ fontWeight: "bold" }}>{truckId} Start</div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Task markers + colored route lines */}
          {routes &&
            Object.keys(routes.routes).map((truckId, idx) => {
              const truckRoute = routes.routes[truckId];
              const positions: LatLngExpression[] = truckRoute.map(
                (t: any) => [t.location.lat, t.location.lng] as LatLngExpression
              );

              return (
                <React.Fragment key={truckId}>
                  <Polyline positions={positions} pathOptions={{ color: truckColors[idx % truckColors.length], weight: 3 }} />
                  {truckRoute.map((t: any, i: number) => (
                    <Marker key={truckId + "-" + i} position={[t.location.lat, t.location.lng] as LatLngExpression}>
                      <Popup>
                        <div style={{ fontWeight: "bold" }}>
                          {truckId} → {t.id} (Load: {t.load})
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

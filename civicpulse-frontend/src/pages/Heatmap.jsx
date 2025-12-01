import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import complaintsData from "../data/complaintsData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const redPin = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const orangePin = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenPin = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getIconByStatus = (status) => {
  if (status === "Pending") return redPin;
  if (status === "In-Progress") return orangePin;
  return greenPin;
};

function Heatmap() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filteredData =
    filter === "All"
      ? complaintsData
      : complaintsData.filter((c) => c.status === filter);

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">

      {/* Page header */}
      <div className="flex justify-between items-center mb-[20px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">
          Heatmap
        </h2>

        {/* Status filter */}
        <select
          className="border border-[#46627F] rounded-[8px] px-[12px] py-[6px] text-[#46627F]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Map container */}
      <div className="rounded-[12px] overflow-hidden border border-[#46627F] shadow">
        <MapContainer
          center={[28.6, 77.2]}
          zoom={6}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredData.map((c) => (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={getIconByStatus(c.status)}
            >
              <Popup>
                <b>{c.category}</b>
                <br />
                {c.description.substring(0, 40)}...
                <br /><br />
                <button
                  className="text-[#46627F] underline"
                  onClick={() => navigate(`/complaints/${c.id}`)}
                >
                  View Details
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Heatmap;

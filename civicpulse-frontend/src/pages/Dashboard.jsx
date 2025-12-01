import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { complaintService } from "../services/complaintService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getAll();
        if (response.success) {
          setComplaints(response.data.complaints);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchComplaints, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min ago`;
  };

  if (loading) {
    return (
      <div className="flex gap-[24px] w-full items-center justify-center p-[40px]">
        <div className="text-[#46627F] text-[16px]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex gap-[24px] w-full">

      {/* Heatmap section */}
      <div className="flex-1 bg-[#FFFFFF] rounded-[16px] border border-[#46627F]
                      shadow-[0px_4px_20px_rgba(0,0,0,0.10)]
                      p-[20px] flex flex-col">

        <h3 className="text-[18px] font-semibold text-[#46627F] text-center mb-[12px]">
          Heatmap
        </h3>

        <div className="w-full">
          <MapContainer
            center={[28.6, 77.2]}
            zoom={6}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {complaints.filter(c => c.location?.coordinates).map((c) => (
              <Marker
                key={c.id}
                position={[c.location.coordinates[1], c.location.coordinates[0]]}
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

        <p className="text-[12px] text-right mt-[6px] text-[#363C3C] opacity-70">
          Updated {getTimeSinceUpdate()}
        </p>
      </div>

      {/* Latest complaints list */}
      <div className="flex-1 bg-[#FFFFFF] rounded-[16px] border border-[#46627F]
                      shadow-[0px_4px_20px_rgba(0,0,0,0.10)]
                      p-[20px] flex flex-col">

        <h3 className="text-[18px] font-semibold text-[#46627F] text-center mb-[12px]">
          Latest Complaints
        </h3>

        <div className="flex-1 overflow-y-auto max-h-[300px]">
          <table className="w-full text-[13px]">
            <thead className="text-[#46627F] font-semibold border-b">
              <tr>
                <th className="py-[6px]">Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="text-[#363C3C]">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-[20px] text-gray-500">
                    No complaints available
                  </td>
                </tr>
              ) : (
                complaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-b">
                    <td>{c.category}</td>
                    <td>{c.description.substring(0, 30)}...</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        c.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                        c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/complaints/${c.id}`)}
                        className="text-[#46627F] underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        <p className="text-[12px] text-right mt-[6px] text-[#363C3C] opacity-70">
          Updated {getTimeSinceUpdate()}
        </p>
      </div>

    </div>
  );
}

export default Dashboard;

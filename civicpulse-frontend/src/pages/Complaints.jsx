import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { complaintService } from "../services/complaintService";

function Complaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getAll();
        if (response.success) {
          setComplaints(response.data.complaints);
        }
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="bg-[#ECF0F1] w-full p-[24px] flex items-center justify-center">
        <div className="text-[#46627F]">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px] overflow-auto">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[20px] font-semibold text-[#46627F]">List of Complaints</h2>
        <div className="flex items-center gap-[12px]">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-[#46627F] rounded-[8px] px-[12px] py-[6px] text-[#46627F]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-[12px] border border-[#46627F] p-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.10)]">
        <table className="w-full text-[13px]">
          <thead className="text-left text-[#46627F] font-semibold border-b">
            <tr>
              <th className="py-[8px]">Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Worker</th>
              <th>Complainant</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-[#363C3C]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-[20px] text-gray-500">
                  No complaints found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-[10px]">{c.category}</td>
                  <td>{c.description}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
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
                  <td>{c.worker?.name || 'Unassigned'}</td>
                  <td>{c.user?.name || 'Unknown'}</td>
                  <td>{c.address}</td>
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
    </div>
  );
}

export default Complaints;

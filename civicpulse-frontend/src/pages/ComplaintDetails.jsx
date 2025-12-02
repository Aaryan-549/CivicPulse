import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintService } from "../services/complaintService";
import { workerService } from "../services/workerService";
import socketService from "../services/socketService";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintResponse, workersResponse] = await Promise.all([
          complaintService.getById(id),
          workerService.getAll()
        ]);

        if (complaintResponse.success) {
          setComplaint(complaintResponse.data);
          setSelectedWorker(complaintResponse.data.worker?.id || "");
        }

        if (workersResponse.success) {
          setWorkers(workersResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch complaint details:', error);
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    socketService.connect();

    const handleComplaintUpdate = async (data) => {
      // Only update if this is the complaint we're viewing
      if (data.complaintId === id) {
        console.log('Real-time update received for complaint:', id);

        // Fetch fresh data to ensure consistency
        try {
          const response = await complaintService.getById(id);
          if (response.success) {
            setComplaint(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch updated complaint:', error);
        }
      }
    };

    socketService.onComplaintUpdated(handleComplaintUpdate);

    return () => {
      socketService.offComplaintUpdated(handleComplaintUpdate);
    };
  }, [id]);

  const handleAssign = async (workerId) => {
    if (!workerId) return;

    try {
      const response = await complaintService.assignWorker(id, workerId);
      if (response.success) {
        setComplaint(response.data);
        setSelectedWorker(workerId);
      }
    } catch (error) {
      console.error('Failed to assign worker:', error);
      alert('Failed to assign worker');
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      const response = await complaintService.reject(id, reason);
      if (response.success) {
        setComplaint(response.data);
      }
    } catch (error) {
      console.error('Failed to reject complaint:', error);
      alert('Failed to reject complaint');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await complaintService.updateStatus(id, newStatus);
      if (response.success) {
        setComplaint(response.data);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#ECF0F1] w-full p-[24px] flex items-center justify-center">
        <div className="text-[#46627F]">Loading complaint details...</div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="bg-[#ECF0F1] w-full p-[24px]">
        <div className="text-red-600">{error || "Complaint not found"}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">
      <div className="flex justify-between items-center mb-[12px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">Complaint Details</h2>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="px-[12px] py-[8px] border border-[#46627F] rounded-[8px] text-[#46627F] hover:bg-[#46627F] hover:text-white transition"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#46627F] shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-[20px]">
        <div className="flex justify-between items-start mb-[12px]">
          <div>
            <h3 className="text-[18px] font-semibold text-[#46627F]">{complaint.category}</h3>
            <p className="text-[14px] text-[#363C3C]/80">{complaint.subcategory}</p>
            {complaint.type === 'traffic' && complaint.plateNumber && (
              <p className="text-[14px] text-[#363C3C] mt-2">
                <strong>Plate Number:</strong> {complaint.plateNumber}
              </p>
            )}
          </div>

          <div className="text-right text-[12px] text-[#363C3C]/80">
            <div>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</div>
            <div>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[16px]">
          {/* Image Display */}
          <div className="col-span-2">
            {complaint.media && complaint.media.length > 0 ? (
              <div className="bg-[#E6EBEE] rounded-[8px] h-[400px] overflow-hidden">
                <img
                  src={complaint.media[0].url}
                  alt="Complaint evidence"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0U2RUJFRSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM0NjYyN0YiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
            ) : (
              <div className="bg-[#E6EBEE] rounded-[8px] h-[400px] flex items-center justify-center">
                <div className="text-[#46627F] text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No image attached</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            <div className="border border-[#46627F] rounded-[8px] p-[10px]">
              <div className="text-[#46627F] font-semibold">Location</div>
              <div className="text-[#363C3C] mt-[6px] text-sm">{complaint.address}</div>
              <div className="text-[#363C3C]/60 mt-[4px] text-xs">
                {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
              </div>
            </div>

            <div className="border border-[#46627F] rounded-[8px] p-[10px]">
              <div className="text-[#46627F] font-semibold">Description</div>
              <div className="text-[#363C3C] mt-[6px] text-sm">{complaint.description}</div>
            </div>

            <div className="border border-[#46627F] rounded-[8px] p-[10px]">
              <div className="text-[#46627F] font-semibold">Validation Status</div>
              <div className="text-[#363C3C] mt-[6px] text-sm">
                <span className={`px-2 py-1 rounded text-xs ${
                  complaint.validationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                  complaint.validationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                  complaint.validationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {complaint.validationStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#46627F] rounded-[8px] p-[14px] mt-[16px]">
          <div className="flex justify-between items-center mb-[8px]">
            <div>
              <strong>Current Status:</strong>
              <span className={`ml-[8px] px-3 py-1 rounded text-sm ${
                complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                complaint.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            <div className="flex gap-2">
              {complaint.status !== 'Resolved' && (
                <button
                  onClick={() => handleStatusUpdate('Resolved')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Mark Resolved
                </button>
              )}
              {complaint.status !== 'In-Progress' && complaint.status !== 'Resolved' && (
                <button
                  onClick={() => handleStatusUpdate('In-Progress')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Mark In Progress
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-[8px]">
            <div>
              <strong>Assigned Worker:</strong>
              <span className="ml-[8px]">{complaint.worker?.name || "Unassigned"}</span>
            </div>

            <div className="flex items-center gap-[10px]">
              <select
                onChange={(e) => handleAssign(e.target.value)}
                value={selectedWorker}
                className="border border-[#46627F] rounded-[6px] px-[8px] py-[6px] text-[14px] text-[#46627F]"
              >
                <option value="">Assign Worker</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <p><strong>Complainant:</strong> {complaint.user?.name || 'Unknown'}</p>
          <p className="mb-[8px]">
            <strong>Contact:</strong> {complaint.user?.email || 'N/A'} | {complaint.user?.phone || 'N/A'}
          </p>

          <div className="flex justify-end gap-3 mt-[12px]">
            <button
              onClick={handleReject}
              disabled={complaint.status === 'Rejected'}
              className={`px-[16px] py-[8px] rounded-[8px] transition ${
                complaint.status === 'Rejected'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#E53935] text-white hover:bg-[#c62828]'
              }`}
            >
              {complaint.status === 'Rejected' ? 'Already Rejected' : 'Reject Complaint'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;

import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import complaintsDataSrc from "../data/complaintsData";
import workersDataSrc from "../data/workersData";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const complaintId = Number(id);

  // Fetch the selected complaint and keep a local editable copy
  const initial = complaintsDataSrc.find((c) => c.id === complaintId) || null;
  const [complaint, setComplaint] = useState(initial);

  // Local workers list used for assignment dropdown
  const [workers] = useState(workersDataSrc);

  const unassignedWorkers = useMemo(
    () => workers.filter((w) => w.complaints === 0 || w.name === complaint?.worker),
    [workers, complaint]
  );

  if (!complaint) return <div className="text-[#363C3C]">Complaint not found</div>;

  const handleAssign = (workerName) => {
    setComplaint((prev) => ({ ...prev, worker: workerName }));
  };

  const handleReject = () => {
    setComplaint((prev) => ({ ...prev, status: "Rejected" }));
  };

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">
      <div className="flex justify-between items-center mb-[12px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">Complaint Details</h2>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="px-[12px] py-[8px] border border-[#46627F] rounded-[8px] text-[#46627F]"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#46627F] shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-[20px]">
        <div className="flex justify-between items-start mb-[12px]">
          <h3 className="text-[18px] font-semibold text-[#46627F]">{complaint.category}</h3>

          <div className="text-right text-[12px] text-[#363C3C]/80">
            <div>{complaint.date}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[16px]">
          <div className="col-span-2 bg-[#E6EBEE] rounded-[8px] h-[200px]" />
          <div className="flex flex-col gap-[12px]">
            <div className="border border-[#46627F] rounded-[8px] p-[10px]">
              <div className="text-[#46627F] font-semibold">Location</div>
              <div className="text-[#363C3C] mt-[6px]">{complaint.location}</div>
            </div>

            <div className="border border-[#46627F] rounded-[8px] p-[10px]">
              <div className="text-[#46627F] font-semibold">Description</div>
              <div className="text-[#363C3C] mt-[6px]">{complaint.description}</div>
            </div>
          </div>
        </div>

        <div className="border border-[#46627F] rounded-[8px] p-[14px] mt-[16px]">
          <div className="flex justify-between items-center mb-[8px]">
            <div>
              <strong>Current Status:</strong> <span className="ml-[8px]">{complaint.status}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-[8px]">
            <div>
              <strong>Assigned Worker:</strong> <span className="ml-[8px]">{complaint.worker}</span>
            </div>

            <div className="flex items-center gap-[10px]">
              <select
                onChange={(e) => handleAssign(e.target.value)}
                value={complaint.worker === "Unassigned" ? "" : complaint.worker}
                className="border border-[#46627F] rounded-[6px] px-[8px] py-[6px] text-[14px] text-[#46627F]"
              >
                <option value="">
                  {complaint.worker === "Unassigned" ? "Assign Worker" : complaint.worker}
                </option>

                {unassignedWorkers.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}

                {/* Additional workers not in the initial unassigned list */}
                {workers
                  .filter((w) => !unassignedWorkers.find((u) => u.id === w.id))
                  .map((w) => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <p><strong>Complainant:</strong> {complaint.complainant}</p>
          <p className="mb-[8px]">
            <strong>Contact:</strong> (hidden) &nbsp;&nbsp; {complaintLocationOrEmpty(complaint)}
          </p>

          <div className="flex justify-end mt-[12px]">
            <button
              onClick={handleReject}
              className="bg-[#E53935] text-white px-[16px] py-[8px] rounded-[8px] hover:bg-[#c62828] transition"
            >
              Reject Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for showing location fallback
function complaintLocationOrEmpty(c) {
  return c.location || "";
}

export default ComplaintDetails;

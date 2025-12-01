import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import workersData from "../data/workersData";
import complaintsData from "../data/complaintsData";

function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wid = Number(id);
  const worker = workersData.find((w) => w.id === wid);
  const assigned = complaintsData.filter((c) => c.worker === worker?.name);

  if (!worker) return <div className="text-[#363C3C]">Worker not found</div>;

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">Worker Details</h2>
        <button onClick={() => navigate(-1)}
          className="px-[12px] py-[8px] border border-[#46627F] rounded-[8px] text-[#46627F]">
          ← Back
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#46627F] p-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
        <p className="text-[18px] font-semibold text-[#46627F] mb-[10px]">{worker.name}</p>

        <div className="grid grid-cols-2 gap-[20px] mb-[20px]">
          <div>
            <p><strong>Phone: </strong>{worker.phone}</p>
            <p><strong>Email: </strong>{worker.email}</p>
          </div>
          <div>
            <p><strong>Total Complaints Assigned: </strong>{assigned.length}</p>
            <p><strong>Status: </strong>{worker.status}</p>
          </div>
        </div>

        {/* List of assigned complaints */}
        <div className="bg-[#E6EBEE] rounded-[8px] p-[12px]">
          <p className="font-semibold text-[#46627F] mb-[8px]">Assigned Complaints</p>
          <ul className="list-disc pl-[20px] text-[#363C3C]">
            {assigned.length === 0 ? (
              <li>No assignments</li>
            ) : (
              assigned.map((c) => (
                <li key={c.id}>
                  {c.category} — {c.description.slice(0, 80)}...
                  <a className="ml-[8px] text-[#46627F] underline" href={`/complaints/${c.id}`}>
                    View
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default WorkerDetails;

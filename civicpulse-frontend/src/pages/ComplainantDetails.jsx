import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import complainantsData from "../data/complainantsData";
import complaintsData from "../data/complaintsData";

function ComplainantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cid = Number(id);
  const person = complainantsData.find(p => p.id === cid);
  const theirComplaints = complaintsData.filter(c => c.complainant === person?.name);

  if (!person) return <div className="text-[#363C3C]">Complainant not found</div>;

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">Complainant Details</h2>
        <button onClick={() => navigate(-1)} className="px-[12px] py-[8px] border border-[#46627F] rounded-[8px] text-[#46627F]">← Back</button>
      </div>

      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#46627F] p-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
        <p className="text-[18px] font-semibold text-[#46627F] mb-[8px]">{person.name}</p>

        <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
          <div>
            <p><strong>Phone: </strong>{person.phone}</p>
            <p><strong>Email: </strong>{person.email}</p>
          </div>
          <div>
            <p><strong>Total Complaints: </strong>{person.totalComplaints}</p>
            <p><strong>Last Complaint: </strong>{theirComplaints[0]?.date || "—"}</p>
          </div>
        </div>

        <div className="bg-[#E6EBEE] rounded-[8px] p-[12px]">
          <p className="font-semibold text-[#46627F] mb-[8px]">Complaints</p>
          <ul className="list-disc pl-[18px] text-[#363C3C]">
            {theirComplaints.length === 0 ? <li>No complaints found</li> : theirComplaints.map(c => (
              <li key={c.id}>
                {c.category} — {c.description.slice(0,80)}...
                <button onClick={() => navigate(`/complaints/${c.id}`)} className="ml-[8px] text-[#46627F] underline">View</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ComplainantDetails;

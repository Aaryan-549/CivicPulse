import React from "react";
import complainantsData from "../data/complainantsData";
import { useNavigate } from "react-router-dom";

function Complainants() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px] overflow-auto">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[20px] font-semibold text-[#46627F]">Complainants</h2>
        {/* Placeholder for future filters */}
      </div>

      <div className="bg-[#FFFFFF] rounded-[12px] border border-[#46627F] p-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.10)]">
        <table className="w-full text-[14px]">
          <thead className="text-left text-[#46627F] font-semibold border-b">
            <tr>
              <th className="py-[8px]">Name</th>
              <th>Location (if any)</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Complaints</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-[#363C3C]">
            {complainantsData.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-[12px]">{p.name}</td>
                <td>—</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.totalComplaints}</td>
                <td>
                  <button onClick={() => navigate(`/complainants/${p.id}`)} className="text-[#46627F] underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Complainants;

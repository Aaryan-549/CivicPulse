import React from "react";
import { useNavigate } from "react-router-dom";
import workersData from "../data/workersData";

function Workers() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px] overflow-auto">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[20px] font-semibold text-[#46627F]">Workers</h2>
      </div>

      <div className="bg-[#FFFFFF] rounded-[12px] border border-[#46627F] p-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.10)]">
        <table className="w-full text-[14px]">
          <thead className="text-left text-[#46627F] font-semibold border-b">
            <tr>
              <th className="py-[8px]">Worker</th>
              <th>Phone</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-[#363C3C]">
            {workersData.map((w) => (
              <tr key={w.id} className="border-b">
                <td className="py-[12px]">{w.name}</td>
                <td>{w.phone}</td>
                <td>{w.complaints}</td>
                <td>{w.status}</td>
                <td>
                  <button
                    onClick={() => navigate(`/workers/${w.id}`)}
                    className="text-[#46627F] underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workers;

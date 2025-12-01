import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome, FaMapMarkerAlt, FaList, FaUsers, FaBriefcase, FaCog, FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/heatmap", label: "Heatmap", icon: <FaMapMarkerAlt /> },
    { to: "/complaints", label: "Complaints", icon: <FaList /> },
    { to: "/complainants", label: "Complainants", icon: <FaUsers /> },
    { to: "/workers", label: "Workers", icon: <FaBriefcase /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-full bg-[#46627F] text-[#FFFFFF] flex flex-col justify-between">

      {/* App logo */}
      <div className="h-[64px] flex items-center justify-center border-b border-[#FFFFFF]/20">
        <h1 className="text-[20px] font-bold">CivicPulse Admin</h1>
      </div>

      {/* Navigation links */}
      <nav className="mt-[40px] flex flex-col gap-[14px] px-[16px]">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] font-semibold transition-all
              text-[#FFFFFF] 
              ${isActive ? "bg-[#3C5470]" : "bg-[#46627F] hover:bg-[#3C5470]"}`
            }
          >
            <span className="text-[18px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="px-[16px] mb-[20px]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-[14px] w-full px-[12px] py-[10px] rounded-[8px] 
                     bg-[#46627F] hover:bg-[#3C5470] text-[#FFFFFF] font-semibold transition"
        >
          <FaSignOutAlt className="text-[18px]" />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;

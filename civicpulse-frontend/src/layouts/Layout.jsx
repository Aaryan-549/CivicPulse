import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.replace("/", "") || "Dashboard";

  // State for the admin dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#ECF0F1]">
      <Sidebar />

      <div className="ml-[240px] w-full flex flex-col">

        {/* Top navigation bar */}
        <header className="relative w-full h-[64px] bg-[#FFFFFF] border-b border-[#46627F] flex items-center justify-between px-[24px]">
          <h2 className="text-[22px] font-semibold text-[#46627F]">
            {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
          </h2>

          {/* Admin menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border border-[#46627F] text-[#46627F] text-[16px]"
            >
              Admin ⌄
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-[6px] w-[160px] bg-[#FFFFFF] border border-[#46627F]/30 rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-50">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full text-left px-[12px] py-[8px] text-[#46627F] hover:bg-[#ECF0F1] transition text-[15px]"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-[12px] py-[8px] text-[#E53935] hover:bg-[#FCEAEA] transition text-[15px] rounded-b-[8px]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="p-[24px] w-full h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;

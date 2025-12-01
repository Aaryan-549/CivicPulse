import React, { useState } from "react";

function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  return (
    <div className="bg-[#ECF0F1] w-full p-[24px]">

      {/* Page header */}
      <div className="flex justify-between items-center mb-[20px]">
        <h2 className="text-[22px] font-semibold text-[#46627F]">Settings</h2>
      </div>

      {/* Main settings container */}
      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#46627F] 
                      shadow-[0px_4px_20px_rgba(0,0,0,0.10)] p-[24px] flex flex-col gap-[24px]">

        {/* Account settings */}
        <section>
          <h3 className="text-[18px] font-semibold text-[#46627F] mb-[12px]">
            Account Settings
          </h3>

          <div className="flex flex-col gap-[16px] max-w-[400px]">
            <input type="text" placeholder="Admin Name"
              className="w-full h-[45px] border border-[#46627F] rounded-[8px] px-[12px] text-[16px] text-[#363C3C] outline-none" />
            <input type="email" placeholder="Email Address"
              className="w-full h-[45px] border border-[#46627F] rounded-[8px] px-[12px] text-[16px] text-[#363C3C] outline-none" />
            <input type="password" placeholder="New Password"
              className="w-full h-[45px] border border-[#46627F] rounded-[8px] px-[12px] text-[16px] text-[#363C3C] outline-none" />

            <button className="w-[160px] h-[45px] bg-[#46627F] text-[#FFFFFF] rounded-[8px] font-semibold hover:bg-[#3C5470] transition">
              Save Changes
            </button>
          </div>
        </section>

        <hr className="border-t border-[#46627F]/30" />

        {/* Notification preferences */}
        <section>
          <h3 className="text-[18px] font-semibold text-[#46627F] mb-[12px]">
            Notification Preferences
          </h3>

          <div className="flex flex-col gap-[12px] text-[#363C3C] text-[16px]">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <input type="checkbox" checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-[18px] h-[18px] accent-[#46627F]" />
              Enable Email Notifications
            </label>

            <label className="flex items-center gap-[10px] cursor-pointer">
              <input type="checkbox" checked={autoSync}
                onChange={() => setAutoSync(!autoSync)}
                className="w-[18px] h-[18px] accent-[#46627F]" />
              Enable Auto Sync with Server
            </label>
          </div>
        </section>

        <hr className="border-t border-[#46627F]/30" />

        {/* System settings */}
        <section>
          <h3 className="text-[18px] font-semibold text-[#46627F] mb-[12px]">
            System Settings
          </h3>

          <div className="flex flex-col gap-[12px] text-[#363C3C] text-[16px]">
            <p>Last Backup: <span className="font-medium">5 hours ago</span></p>
            <p>Version: <span className="font-medium text-[#46627F]">v1.0</span></p>

            <button className="w-[200px] h-[45px] bg-[#46627F] text-[#FFFFFF]
                         rounded-[8px] font-semibold hover:bg-[#3C5470] transition mt-[10px]">
              Backup Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;

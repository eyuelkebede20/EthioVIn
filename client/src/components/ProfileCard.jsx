import React from "react";

const ProfileCard = ({ email, role, credits, onSwitchAccount, onLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b bg-slate-50">
        <p className="font-bold text-slate-800 truncate">{email}</p>
        <p className="text-xs text-blue-600 font-bold uppercase mt-1">{role ? role.replace("_", " ") : "User"}</p>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 font-bold">Credit Balance</span>
          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">{credits} pts</span>
        </div>
      </div>

      <div className="p-2">
        <button onClick={onSwitchAccount} className="w-full text-left px-4 py-2 text-sm text-slate-700 font-bold hover:bg-slate-100 rounded-lg transition">
          Switch Account
        </button>
        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition mt-1">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

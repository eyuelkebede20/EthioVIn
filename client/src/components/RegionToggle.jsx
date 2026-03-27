import React from "react";

const RegionToggle = ({ region, onRegionChange }) => {
  return (
    <div className="inline-flex bg-slate-200 p-1 rounded-xl mb-6">
      <button onClick={() => onRegionChange("asean")} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${region === "asean" ? "bg-white shadow text-blue-600" : "text-slate-600"}`}>
        ASEAN / GLOBAL (17 Digits)
      </button>
      <button onClick={() => onRegionChange("japan")} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${region === "japan" ? "bg-white shadow text-blue-600" : "text-slate-600"}`}>
        JAPAN (Chassis No.)
      </button>
    </div>
  );
};

export default RegionToggle;

import React from "react";

const SearchBox = ({ region, vin, setVin, error, setError, onDecode }) => {
  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (region === "asean") {
      value = value.replace(/[IOQ]/g, "").slice(0, 17);
      if (value.length > 0 && !/^[A-Z0-9]*$/.test(value)) return;
    } else {
      value = value.slice(0, 15);
      if (value.length > 0 && !/^[A-Z0-9-]*$/.test(value)) return;
    }

    setVin(value);
    setError("");
  };

  return (
    <div className="relative group text-left">
      <input
        type="text"
        value={vin}
        onChange={handleInputChange}
        placeholder={region === "asean" ? "Enter 17-digit VIN..." : "e.g. GDH201-1234567"}
        className={`w-full p-5 text-lg border-2 rounded-2xl outline-none transition-all ${error ? "border-red-400" : "border-slate-200 focus:border-blue-500"}`}
      />
      <button onClick={onDecode} className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition">
        DECODE
      </button>
      {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
    </div>
  );
};

export default SearchBox;

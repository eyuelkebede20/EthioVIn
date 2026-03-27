import React, { useState } from "react";
import Navbar from "./components/Navbar";
import RegionToggle from "./components/RegionToggle";
import SearchBox from "./components/SearchBox";
import ResultCard from "./components/ResultCard";

const App = () => {
  const [region, setRegion] = useState("asean");
  const [vin, setVin] = useState("");
  const [error, setError] = useState("");
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setVin("");
    setError("");
    setCarData(null);
  };

  const handleDecode = async () => {
    if (region === "asean" && vin.length !== 17) {
      setError("ASEAN/Global VIN must be exactly 17 characters.");
      return;
    }
    if (region === "japan" && !vin.includes("-")) {
      setError("Japan Chassis numbers usually require a hyphen (e.g., NCP10-1234).");
      return;
    }

    setLoading(true);
    setError("");
    setCarData(null);

    try {
      const response = await fetch("http://localhost:5000/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin, region }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      // NEW ERROR HANDLER
      if (data.confidence_score < 0.4 || data.manufacturer.toLowerCase() === "unknown") {
        setError("Could not confidently decode this VIN. Please check the number and try again.");
        setCarData(null);
      } else {
        setCarData(data);
      }
    } catch (error) {
      setError(`Error decoding VIN. Please try again., ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="max-w-3xl mx-auto mt-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Decode Any Import in Seconds</h2>
        <p className="text-slate-500 mb-8">AI-powered technical specs and Ethiopian market valuation.</p>

        <RegionToggle region={region} onRegionChange={handleRegionChange} />

        <SearchBox region={region} vin={vin} setVin={setVin} error={error} setError={setError} onDecode={handleDecode} />
        {loading && <p className="mt-4 text-blue-600 font-bold">Decoding...</p>}
      </main>

      <section className="max-w-5xl mx-auto mt-16 flex justify-center px-6 pb-12">{carData && <ResultCard data={carData} />}</section>
    </div>
  );
};

export default App;

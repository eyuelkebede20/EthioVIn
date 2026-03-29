import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegionToggle from "../components/RegionToggle";
import SearchBox from "../components/SearchBox";
import ResultCard from "../components/ResultCard";

const Home = () => {
  const [region, setRegion] = useState("asean");
  const [vin, setVin] = useState("");
  const [error, setError] = useState("");
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError("Japan Chassis numbers usually require a hyphen.");
      return;
    }

    setLoading(true);
    setError("");
    setCarData(null);

    try {
      const token = sessionStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5000/api/vin/decode", {
        method: "POST",
        headers,
        body: JSON.stringify({ vin, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requireSignup) {
          navigate("/register");
          throw new Error(data.error);
        }
        throw new Error(data.error || "Failed to fetch data");
      }

      if (data.confidence_score < 0.4 || data.manufacturer.toLowerCase() === "unknown") {
        setError("Could not confidently decode this VIN. Please check the number and try again.");
        setCarData(null);
      } else {
        setCarData(data);

        try {
          const existingHistory = JSON.parse(sessionStorage.getItem("vinHistory")) || [];
          const updatedHistory = [data, ...existingHistory.filter((item) => item.vin !== data.vin)];
          sessionStorage.setItem("vinHistory", JSON.stringify(updatedHistory));
        } catch (err) {
          sessionStorage.setItem("vinHistory", JSON.stringify([data]));
          console.log(err);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="max-w-3xl mx-auto mt-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Decode Any Import in Seconds</h2>
        <p className="text-slate-500 mb-8">AI-powered technical specs and Ethiopian market valuation.</p>

        <RegionToggle region={region} onRegionChange={handleRegionChange} />

        <SearchBox region={region} vin={vin} setVin={setVin} error={error} setError={setError} onDecode={handleDecode} />
        {loading && <p className="mt-4 text-blue-600 font-bold">Decoding...</p>}
        {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}
      </main>

      <section className="max-w-5xl mx-auto mt-16 flex justify-center px-6 pb-12">{carData && <ResultCard data={carData} />}</section>
    </>
  );
};

export default Home;

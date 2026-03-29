import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("userRole");
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || role === "user") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      let endpoint = "";
      if (role === "super_admin") endpoint = "/api/admin/super";
      else if (role.includes("insurance")) endpoint = "/api/admin/insurance";
      else if (role.includes("garage")) endpoint = "/api/admin/garage";

      try {
        const res = await fetch(`http://localhost:5000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        setData(result.message);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [navigate, role, token]);

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h2 className="text-3xl font-extrabold mb-6 capitalize">{role.replace("_", " ")} Dashboard</h2>
      {error && <p className="text-red-500 font-bold">{error}</p>}
      {data ? (
        <div className="p-6 bg-white shadow rounded-xl border border-slate-200">
          <p className="text-slate-700 font-medium">{data}</p>
        </div>
      ) : (
        !error && <p>Loading dashboard data...</p>
      )}
    </div>
  );
};

export default Dashboard;

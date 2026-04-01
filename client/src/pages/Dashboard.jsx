import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboard from "../components/SuperAdminDashboard";
import SubAdminDashboard from "../components/SubAdminDashboard";
import GarageOfficerDashboard from "../components/GarageOfficerDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("userRole");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token || role === "user" || !role) {
      navigate("/login");
    }
  }, [navigate, token, role]);

  if (!token || role === "user" || !role) return null;

  return (
    <div className="w-full pb-12">
      {role === "super_admin" && <SuperAdminDashboard />}
      {role === "garage_officer" && <GarageOfficerDashboard />}
      {(role === "garage_admin" || role === "insurance_admin") && <SubAdminDashboard />}
      {role === "insurance_officer" && (
        <div className="max-w-5xl mx-auto mt-12 px-6">
          <h2 className="text-3xl font-extrabold mb-6 capitalize">{role.replace("_", " ")} Dashboard</h2>
          <p>Officer form submission UI pending.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

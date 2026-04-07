import React, { useState, useEffect } from "react";

const SuperAdminDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [organizations, setOrganizations] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("garage");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const token = sessionStorage.getItem("token");

  const fetchOrganizations = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrganizations(data);
    } catch (err) {
      console.error("Failed to fetch organizations");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${backendUrl}/api/admin/organizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orgName, orgType, adminEmail, adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create organization");

      setMessage(data.message);
      setOrgName("");
      setAdminEmail("");
      setAdminPassword("");
      fetchOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h2 className="text-3xl font-extrabold mb-6">Super Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Create Organization & Admin</h3>
          {error && <p className="text-red-500 font-bold mb-2">{error}</p>}
          {message && <p className="text-green-500 font-bold mb-2">{message}</p>}
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full p-3 border rounded" required />
            <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="w-full p-3 border rounded">
              <option value="garage">Garage</option>
              <option value="insurance">Insurance</option>
            </select>
            <input type="email" placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full p-3 border rounded" required />
            <input type="password" placeholder="Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 border rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">
              Create
            </button>
          </form>
        </div>

        <div className="bg-white p-6 shadow rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Existing Organizations</h3>
          {organizations.length === 0 ? (
            <p>No organizations found.</p>
          ) : (
            <ul className="space-y-3">
              {organizations.map((org) => (
                <li key={org._id} className="p-3 bg-slate-50 border rounded flex justify-between">
                  <span className="font-bold">{org.name}</span>
                  <span className="text-sm uppercase text-blue-600">{org.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

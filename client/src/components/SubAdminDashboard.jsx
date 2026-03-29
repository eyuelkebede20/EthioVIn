import React, { useState, useEffect } from "react";

const SubAdminDashboard = () => {
  const [officers, setOfficers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("userRole");
  const formattedRole = role.replace("_admin", "");

  const fetchOfficers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/officers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOfficers(data);
    } catch (err) {
      console.error("Failed to fetch officers");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/officers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create officer");

      setMessage(data.message);
      setEmail("");
      setPassword("");
      fetchOfficers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h2 className="text-3xl font-extrabold mb-6 capitalize">{role.replace("_", " ")} Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold mb-4 capitalize">Create {formattedRole} Officer</h3>
          {error && <p className="text-red-500 font-bold mb-2">{error}</p>}
          {message && <p className="text-green-500 font-bold mb-2">{message}</p>}
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="email" placeholder="Officer Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" required />
            <input type="password" placeholder="Temporary Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">
              Create Officer
            </button>
          </form>
        </div>

        <div className="bg-white p-6 shadow rounded-xl border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Existing Officers</h3>
          {officers.length === 0 ? (
            <p>No officers found.</p>
          ) : (
            <ul className="space-y-3">
              {officers.map((officer) => (
                <li key={officer._id} className="p-3 bg-slate-50 border rounded flex justify-between">
                  <span className="font-bold">{officer.email}</span>
                  <span className="text-sm uppercase text-slate-500">{officer.role.replace("_", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubAdminDashboard;

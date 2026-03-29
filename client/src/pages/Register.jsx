import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Default role 'user' assigned by backend
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userRole", data.role);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Create Account</h2>
      {error && <p className="text-red-500 mb-4 text-center font-bold">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition">
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;

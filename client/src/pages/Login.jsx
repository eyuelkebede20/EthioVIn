import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userRole", data.role);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center font-bold">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition">
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-slate-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;

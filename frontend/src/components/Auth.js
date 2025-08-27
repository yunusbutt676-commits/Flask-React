import { useState } from "react";
import API from "../api";

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true); // toggle tabs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { username, password } : { username, password, role: "user" };
      const res = await API.post(endpoint, payload);

      if (isLogin && res.data.token) {
        setToken(res.data.token);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isLogin ? "Login" : "Register"}
      </h2>

      <input
        placeholder="Username"
        className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded font-semibold transition duration-200"
        onClick={handleSubmit}
      >
        {isLogin ? "Login" : "Register"}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes("created") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

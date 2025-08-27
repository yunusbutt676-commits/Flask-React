import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import AddJob from "./components/AddJob";
import JobList from "./components/JobList";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ username: payload.username, role: payload.role });
      } catch {
        handleLogout();
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!token || !user ? (
        <div className="flex items-center justify-center p-4">
          <Auth setToken={setToken} />
        </div>
      ) : (
        <div>
          <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {user.role === "admin" ? "Admin Dashboard" : "Job Portal"}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="font-medium">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          </nav>

          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {user.role === "admin" ? (
              <AddJob
                token={token}
                isAdmin={true}
                username={user.username}
                onLogout={handleLogout}
              />
            ) : (
              <JobList
                token={token}
                username={user.username}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

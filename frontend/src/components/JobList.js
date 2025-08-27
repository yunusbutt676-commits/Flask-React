import { useState, useEffect } from "react";
import API, { setAuthToken } from "../api";

export default function JobDashboard({ token, username, onLogout }) {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [message, setMessage] = useState("");

  // Set auth token if user is logged in
  useEffect(() => {
    if (token) setAuthToken(token);
    fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching jobs");
    }
  };

  const handleRecommend = async () => {
    if (!skills.trim()) {
      setMessage("Please enter your skills");
      return;
    }
    try {
      const res = await API.post("/recommendation/", { skills });
      setRecommendedJobs(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error fetching recommendations");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Recommend Jobs */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Recommend Jobs</h2>
          <input
            placeholder="Enter your skills"
            className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
          <button
            onClick={handleRecommend}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full transition"
          >
            Recommend
          </button>

          {recommendedJobs.length > 0 && (
            <ul className="mt-4 list-disc pl-5 space-y-2">
              {recommendedJobs.map((job, idx) => (
                <li key={idx} className="border p-3 rounded hover:bg-gray-50 transition">
                  <strong>{job.title}</strong>: {job.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* All Jobs */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">All Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs available</p>
          ) : (
            <ul className="space-y-2">
              {jobs.map((job, idx) => (
                <li key={idx} className="border p-3 rounded hover:bg-gray-50 transition">
                  <strong>{job.title}</strong>: {job.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
}

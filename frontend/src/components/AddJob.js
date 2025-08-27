import { useState, useEffect } from "react";
import API, { setAuthToken } from "../api";

export default function AddJob({ token, isAdmin, username, onLogout }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleSubmit = async () => {
    if (!title || !description) {
      setMessage("Please provide title and description");
      return;
    }
    try {
      if (editingJob) {
        const res = await API.put(`/jobs/${editingJob.id}`, { title, description });
        setMessage(res.data.message);
      } else {
        const res = await API.post("/jobs/", { title, description });
        setMessage(res.data.message);
      }
      setTitle(""); setDescription(""); setEditingJob(null);
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving job");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setMessage("");
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      setMessage(res.data.message);
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting job");
    }
  };

  if (!isAdmin) return <p className="text-red-500 text-center mt-4">Access denied. Admin only.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Add / Edit Job */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">{editingJob ? "Edit Job" : "Add Job"}</h2>
          <input
            placeholder="Job Title"
            className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Job Description"
            className="border border-gray-300 p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 w-full rounded transition duration-200"
            onClick={handleSubmit}
          >
            {editingJob ? "Update Job" : "Add Job"}
          </button>
        </div>

        {/* Jobs List */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">All Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs available</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.id} className="py-4 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{job.title}</p>
                    <p className="text-gray-700">{job.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

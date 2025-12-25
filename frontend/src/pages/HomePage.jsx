import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { token, user } = useSelector((state) => state.auth);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/complaints",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (error) {
      console.error("Failed to raise complaint", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Complaints</h1>

      {user?.role === "resident" && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="Complaint title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Raise Complaint
          </button>
        </form>
      )}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ul className="space-y-2">
          {complaints.map((c) => (
            <li key={c._id} className="p-3 border rounded">
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {c.status || "Pending"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;

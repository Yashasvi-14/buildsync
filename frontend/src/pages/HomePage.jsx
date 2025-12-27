import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [profile, setProfile] = useState(null);

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
    const fetchData = async () => {
    try {
      const res = await API.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      fetchComplaints();
    } catch (error) {
      console.error("Failed to fetch user profile");
    }
  };

  fetchData();
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
      {profile && (
        <div className="mb-4 p-3 bg-gray-100 border rounded">
            <p className="text-sm text-gray-700">
                Logged in as: <b>{profile.name}</b> ({profile.role})
            </p>
        </div>
      )}
      {profile?.role === "manager" && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-sm text-yellow-800">
            Manager Mode: Viewing complaints from buildings you manage.
          </p>
        </div>
      )}

      {profile?.role === "admin" && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-300 rounded">
          <p className="text-sm text-purple-800">
            Admin Mode: Viewing all complaints in the system.
          </p>
        </div>
      )}
      
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
              {(profile?.role === "manager" || profile?.role === "admin") && (
                <div className="mt-2">
                  <select
                  onChange={(e) => c.newStatus = e.target.value}
                  defaultValue={c.status || "Pending"}
                  className="border p-1 rounded mr-2"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                    </select>
                    
                    <button
                    onClick={async () => {
                      try {
                        await API.put(
                          `/complaints/${c._id}`,
                          { status: c.newStatus || c.status },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        fetchComplaints();
                      } catch (error) {
                        console.error("Status update failed", error);
                      }
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Update
                      </button>
                  </div>
                )}
                </li>
              ))}
              </ul>
            )}
            </div>
            )
          };

export default HomePage;

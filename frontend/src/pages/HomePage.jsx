import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [profile, setProfile] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});

  const { token, user } = useSelector((state) => state.auth);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get profile
        const profileRes = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // Get staff (ONLY for admin/manager)
        if (
          profileRes.data.role === "manager" ||
          profileRes.data.role === "admin"
        ) {
          try {
            const staffRes = await API.get("/admin/staff", {
              headers: { Authorization: `Bearer ${token}` },
            });

            console.log("STAFF RESPONSE:", staffRes.data); // 🔍 DEBUG
            setStaff(staffRes.data);
          } catch (error) {
            console.error(
              "Failed to fetch staff list",
              error.response?.data || error.message
            );
          }
        }

        fetchComplaints();
      } catch (error) {
        console.error("Failed to fetch user profile", error);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (error) {
      console.error("Failed to raise complaint", error);
    }
  };

  const assignStaff = async (complaintId) => {
    const staffId = selectedStaff[complaintId];

    if (!staffId) {
      alert("Please select a staff member");
      return;
    }

    try {
      await API.put(
        `/complaints/${complaintId}/assign`,
        { staffId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComplaints();
    } catch (error) {
      console.error(
        "Staff assignment failed",
        error.response?.data || error.message
      );
    }
  };

  const updateStatus = async (complaintId, status) => {
    try {
      await API.put(
        `/complaints/${complaintId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComplaints();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Complaints</h1>

      {/* Profile */}
      {profile && (
        <div className="mb-4 p-3 bg-gray-100 border rounded">
          <p className="text-sm text-gray-700">
            Logged in as: <b>{profile.name}</b> ({profile.role})
          </p>
        </div>
      )}

      {/* Role banners */}
      {profile?.role === "manager" && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          Manager Mode
        </div>
      )}

      {profile?.role === "admin" && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-300 rounded">
          Admin Mode
        </div>
      )}

      {/* Resident complaint form */}
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Raise Complaint
          </button>
        </form>
      )}

      {/* Complaints list */}
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ul className="space-y-3">
          {complaints.map((c) => (
            <li key={c._id} className="p-4 border rounded bg-white shadow-sm">
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {c.status || "Pending"}
              </p>

              {/* Status update */}
              {(profile?.role === "manager" ||
                profile?.role === "admin") && (
                <div className="mt-2 flex gap-2">
                  <select
                    onChange={(e) =>
                      updateStatus(c._id, e.target.value)
                    }
                    defaultValue={c.status || "Pending"}
                    className="border p-1 rounded"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              )}

              {/* Assign staff */}
              {(profile?.role === "manager" ||
                profile?.role === "admin") && (
                <div className="mt-2 flex gap-2">
                  <select
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        [c._id]: e.target.value,
                      })
                    }
                    className="border p-1 rounded"
                    defaultValue=""
                  >
                    <option value="">Assign to staff</option>
                    {staff.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => assignStaff(c._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Assign
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
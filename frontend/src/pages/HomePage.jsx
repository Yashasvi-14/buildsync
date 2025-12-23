import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
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

    fetchComplaints();
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Complaints</h1>

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

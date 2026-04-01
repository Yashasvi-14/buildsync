import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/pending-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };
  const fetchAllUsers = async () => {
  try {
    const res = await API.get("/users/building-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers(res.data);
  } catch (error) {
    console.error("Failed to fetch users");
  }
};
const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
  }, []);

  const approveUser = async (id) => {
    try {
      await API.patch(
        `/admin/approve-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Approval failed");
    }
  };

  
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Pending Users</h1>

      {users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u._id} className="p-3 border rounded flex justify-between">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-600">{u.role}</p>
              </div>

              <button
                onClick={() => approveUser(u._id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">All Users</h2>
      {allUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
      <div className="space-y-2">
        {allUsers.map((user) => (
          <div
          key={user._id}
          className="p-3 bg-white border rounded flex justify-between"
          >
          <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="text-sm text-gray-600">
              {user.role}
            </span>
            </div>
          ))}
          </div>
        )}
      </div>
  );
};

export default UsersPage;
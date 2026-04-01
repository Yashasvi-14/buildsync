import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident",
    buildingCode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users/register", form);
      alert("Registered successfully. Wait for approval.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />

          <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="resident">Resident</option>
            <option value="staff">Staff</option>
          </select>

          <input name="buildingCode" placeholder="Building Code" onChange={handleChange} className="w-full p-2 border rounded" />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
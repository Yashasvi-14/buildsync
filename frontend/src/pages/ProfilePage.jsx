import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {/* Profile Picture */}
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
      )}

      <p className="mb-2">
        <b>Name:</b> {profile.name}
      </p>

      <p className="mb-2">
        <b>Email:</b> {profile.email}
      </p>

      <p className="mb-2">
        <b>Role:</b> {profile.role}
      </p>

      <p className="mb-2">
        <b>Building:</b> {profile.building?.name || "Not assigned"}
      </p>
    </div>
  );
};

export default ProfilePage;
import API from "./api";

const getMyFlat = async (token) => {
  const res = await API.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // The profile already contains the user data
};

export default { getMyFlat };

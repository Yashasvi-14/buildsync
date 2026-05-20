import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector } from "react-redux";

const BuildingsPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [flats, setFlats] = useState([]);
  const [flatNumber, setFlatNumber] = useState("");
  const [residents, setResidents] = useState([]);
  const [assignSelection, setAssignSelection] = useState({});
  const { token } = useSelector((state) => state.auth);

  const fetchBuildings = async () => {
    try {
      const res = await API.get("/buildings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setBuildings(list);
      if (list.length > 0) {
        setSelectedBuildingId(list[0]._id);
      } else {
        setSelectedBuildingId("");
      }
    } catch (error) {
      console.error("Failed to fetch buildings", error);
    }
  };

  const fetchFlats = async (buildingId) => {
    try {
      const res = await API.get(`/buildings/${buildingId}/flats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlats(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch flats", error);
      setFlats([]);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await API.get("/users/building-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(res.data) ? res.data : [];
      setResidents(list.filter((user) => user.role === "resident"));
    } catch (error) {
      console.error("Failed to fetch residents", error);
      setResidents([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBuildings();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedBuildingId) {
      fetchFlats(selectedBuildingId);
      fetchResidents();
    } else {
      setFlats([]);
      setResidents([]);
    }
  }, [selectedBuildingId, token]);

  const handleAssignResident = async (flatId) => {
    const residentId = assignSelection[flatId];

    if (!residentId) {
      alert("Please select a resident");
      return;
    }

    try {
      await API.put(
        `/buildings/${selectedBuildingId}/flats/${flatId}/assign-resident`,
        { residentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignSelection((prev) => ({ ...prev, [flatId]: "" }));
      fetchFlats(selectedBuildingId);
    } catch (error) {
      console.error("Failed to assign resident", error);
      alert(error.response?.data?.message || "Failed to assign resident");
    }
  };

  const handleAddFlat = async (e) => {
    e.preventDefault();
    if (!selectedBuildingId || !flatNumber.trim()) {
      alert("Please enter a flat number");
      return;
    }

    try {
      await API.post(
        `/buildings/${selectedBuildingId}/flats`,
        { flatNumber: flatNumber.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFlatNumber("");
      fetchFlats(selectedBuildingId);
    } catch (error) {
      console.error("Failed to add flat", error);
      alert(error.response?.data?.message || "Failed to add flat");
    }
  };

  const selectedBuilding = buildings.find((b) => b._id === selectedBuildingId);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Buildings & Flats Management</h1>

      {buildings.length === 0 ? (
        <p className="text-gray-600">No buildings found.</p>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Building
          </label>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="w-full max-w-md border p-2 rounded"
          >
            {buildings.map((building) => (
              <option key={building._id} value={building._id}>
                {building.name} ({building.buildingCode})
              </option>
            ))}
          </select>

          {selectedBuilding && (
            <div className="p-3 border rounded bg-white">
              <p className="font-medium">{selectedBuilding.name}</p>
              <p className="text-sm text-gray-600">
                Code: {selectedBuilding.buildingCode}
              </p>
            </div>
          )}

          {selectedBuildingId && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Add Flat</h2>
              <form onSubmit={handleAddFlat} className="flex gap-2 mb-4 max-w-md">
                <input
                  type="text"
                  placeholder="Flat number"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="flex-1 border p-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add Flat
                </button>
              </form>

              <h2 className="text-lg font-semibold mb-2">Flats</h2>
              {flats.length === 0 ? (
                <p className="text-gray-600">No flats yet.</p>
              ) : (
                <ul className="space-y-2">
                  {flats.map((flat) => (
                    <li
                      key={flat._id}
                      className="p-3 border rounded bg-white flex justify-between items-center gap-2"
                    >
                      <span className="font-medium">{flat.flatNumber}</span>
                      {flat.resident ? (
                        <span className="text-sm text-gray-600">
                          {flat.resident.name}
                        </span>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <select
                            value={assignSelection[flat._id] || ""}
                            onChange={(e) =>
                              setAssignSelection((prev) => ({
                                ...prev,
                                [flat._id]: e.target.value,
                              }))
                            }
                            className="border p-1 rounded text-sm"
                          >
                            <option value="">Select resident</option>
                            {residents.map((resident) => (
                              <option key={resident._id} value={resident._id}>
                                {resident.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignResident(flat._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
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
          )}
        </div>
      )}
    </div>
  );
};

export default BuildingsPage;

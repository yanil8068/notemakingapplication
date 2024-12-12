import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const token = Cookies.get("Note") || null; // Retrieve token from cookies
  console.log("token", token);

  const [editMode, setEditMode] = useState(false); // Toggle between view and edit modes
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (token && !user) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("user", response.data.user);
          login(response?.data?.user); // Save user data in context
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Cookies.remove("Note");
        });
    }
  }, [user, token]);

  // Prefill data when entering edit mode
  const handleEdit = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
      setEditMode(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  console.log("user", user);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}api/user/${user._id}/update`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Profile updated:", response.data);
      setEditMode(false); // Exit edit mode
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("user", response.data.user);
          login(response?.data?.user); // Save user data in context
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Cookies.remove("Note");
        });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  async function handleSignOut() {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/user/logout`); // Call your logout API
      Cookies.remove("Note"); // Remove cookie
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  }

  async function dashboard() {
    navigate("/dashboard");
  }

  return (
    <div className="container mt-2 vh-100 ">
      <div className="border rounded border-success shadow-lg p-2">
        <div className="d-flex justify-content-between mb-2">
          <button
            className="btn btn-sm btn-secondary mt-2"
            onClick={handleSignOut}
          >
            Logout
          </button>
          <h1 className="text-center mb-1 text-success mt-2">Profile</h1>
          <button className="btn  btn-sm btn-success mt-2" onClick={dashboard}>
            Dashboard
          </button>
        </div>

        <hr />

        {editMode ? (
          <form onSubmit={handleSaveProfile} className="row g-1">
            <div className="col-md-6">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success me-2">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {user ? (
              <div className="row">
                <div className="col-md-6">
                  <strong>Name:</strong> {user?.name}
                </div>
                <div className="col-md-6">
                  <strong>Email:</strong> {user?.email}
                </div>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
            <div className="mt-3">
              <button className="btn btn-warning" onClick={handleEdit}>
                Edit Profile
              </button>
            </div>
          </>
        )}

        <hr />
      </div>
    </div>
  );
};

export default Profile;

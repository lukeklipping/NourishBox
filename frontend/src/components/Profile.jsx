import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  // State to manage editable form values for name and email
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Populate form data with current user info when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sends updated profile data to backend and updates local state and storage
  const handleUpdate = async () => {
    setMessage("");
    setError("");
    try {
      const res = await axios.put(`/api/users/${user._id}`, formData);
      localStorage.setItem("nourishUser", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // Confirm and delete user account from database and local state
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/users/${user._id}`);
      localStorage.removeItem("nourishUser");
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError("Failed to delete account.");
    }
  };

  // Logs user out by clearing local storage and state
  const handleLogout = () => {
    localStorage.removeItem("nourishUser");
    setUser(null);
    navigate("/login");
  };

  // If user isn't logged in, prompt them to login
  if (!user) return <p className="text-center mt-10 text-red-500">Please log in to view your profile.</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">Your Profile</h2>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 underline hover:text-red-700"
        >
          Logout
        </button>
      </div>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label className="block mb-1 text-gray-700">Name</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border mb-4 rounded"
      />

      <label className="block mb-1 text-gray-700">Email (cannot change)</label>
      <input
        name="email"
        value={formData.email}
        disabled
        className="w-full p-2 border mb-4 bg-gray-100 cursor-not-allowed rounded"
      />

      <div className="flex gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleUpdate}
        >
          Update Info
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;

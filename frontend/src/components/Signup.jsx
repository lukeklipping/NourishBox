import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password) =>
    password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation and creating a user 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return setError("All fields are required.");
    }

    if (!isEmailValid(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!isPasswordValid(password)) {
      return setError("Password must be at least 6 characters, include an uppercase letter and a number.");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/signup", formData);
      localStorage.setItem("nourishUser", JSON.stringify(res.data.user));
      onSignup(res.data.user);
      alert("You have successfully signed up!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Signup failed. Try again.";
      setError(msg);
      console.error("Signup error:", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <p className="text-sm text-gray-700 mt-1">
          Password must be at least 6 characters, include an uppercase letter and a number.
        </p>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <button
          className="text-green-600 underline"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;

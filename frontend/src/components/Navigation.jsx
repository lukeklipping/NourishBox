import React from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-green-200 p-4 flex justify-between items-start gap-2 shadow-md sticky top-0 z-50">
      <h1
        className="text-2xl font-bold text-green-900 cursor-pointer"
        onClick={() => navigate("/")}
      >
        NourishBox
      </h1>
      <div className="space-x-3 ml-20">
        <button
          onClick={() => navigate("/mealPlans")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
        >
          Our Plans
        </button>
        <button
          onClick={() => navigate("/meals")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
        >
          Our Meals
        </button>
        {user ? (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
            >
              View Profile
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
            >
              Signup
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
            >
              Login
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/cart")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
        >
          Shopping Cart
        </button>
        <button
          onClick={() => navigate("/authors")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded"
        >
          About the Authors
        </button>
      </div>
      <div>
        <Search />
      </div>
    </nav>
  );
};

export default Navbar;

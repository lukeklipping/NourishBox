import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("searchTerm") || "";

  const fetchMeals = async (term) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/search/meals?searchTerm=${encodeURIComponent(
          term
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }
      const data = await response.json();
      setMeals(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load meals:", err);
      setError("Unable to load meals. Please try again later.");
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchMeals(searchTerm);
    } else {
      navigate("/"); // Redirect to homepage if no search term
      setMeals([]);
    }
  }, [searchTerm, navigate]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {searchTerm && (
        <>
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            Search Results for "{searchTerm}"
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {isLoading ? (
            <p>Loading...</p>
          ) : meals.length > 0 ? (
            <ul className="space-y-2">
              {meals.map((meal) => (
                <li
                  key={meal._id}
                  className="border-b border-gray-200 py-2 text-gray-700"
                >
                  <Link
                    to={`/meals/${meal._id}`}
                    className="text-green-600 hover:text-green-800 underline"
                  >
                    {meal.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No meals found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;

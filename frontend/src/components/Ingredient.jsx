import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Ingredient = () => {
  const { id } = useParams();
  const [meals, setMeals] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [specificMeal, setSpecificMeal] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all meals for dropdown
  const fetchAllMeals = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/meals");
      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }
      const data = await response.json();
      console.log("Fetched meals:", data);
      setMeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load meals:", err);
      setError("Unable to load meals. Please try again later.");
    }
  };

  // Fetch specific meal by ID
  const fetchMealById = async (mealId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/meals/${mealId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch meal");
      }
      const data = await response.json();
      setSpecificMeal(data);
      setSelectedFood(data.name); // Auto-select in dropdown
      setError(null);
    } catch (err) {
      console.error("Failed to load meal:", err);
      setError("Unable to load meal. Please try again later.");
      setSpecificMeal(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMeals(); // Always fetch all meals for dropdown
    if (id) {
      fetchMealById(id); // Fetch specific meal if ID is present
    }
  }, [id]);

  // Use specificMeal if ID is present, otherwise use selectedFood from dropdown
  const selectedMeal = id
    ? specificMeal
    : meals.find((meal) => meal.name === selectedFood);

  useEffect(() => {
    if (!id && selectedMeal?.name && selectedFood !== selectedMeal.name) {
      setSelectedFood(selectedMeal.name);
    }
  }, [selectedMeal, id]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans flex flex-col">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start py-10 px-4 md:px-0">
          {/* Left: Ingredients Section */}
          <div className="bg-white p-6 rounded-lg shadow-md self-start w-full min-w-[300px]">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && !selectedMeal && (
              <p className="text-gray-500">Select a meal to see ingredients.</p>
            )}
            {selectedMeal && (
              <ul className="list-disc pl-5">
                {selectedMeal.ingredients &&
                selectedMeal.ingredients.length > 0 ? (
                  selectedMeal.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No ingredients listed.</li>
                )}
              </ul>
            )}
          </div>
          {/* Right: Meal Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-md self-start w-full min-w-[300px] mt-8 md:mt-0">
            <h2 className="text-xl font-semibold mb-4">Delicious Foods!</h2>
            <select
              value={selectedFood}
              onChange={(e) => {
                const selectedName = e.target.value;
                setSelectedFood(selectedName);

                const selected = meals.find(
                  (meal) => meal.name === selectedName
                );
                if (selected?._id) {
                  fetchMealById(selected._id); // Fetch full meal data by ID
                } else {
                  setSpecificMeal(null); // Clear if nothing found
                }
              }}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">Select a Meal</option>
              {meals.map((meal) => (
                <option key={meal._id} value={meal.name}>
                  {meal.name}
                </option>
              ))}
            </select>
            {selectedMeal?.imageUrl && (
              <img
                src={selectedMeal.imageUrl}
                alt={selectedMeal.name}
                className="object-contain-w-full max-w-md h-auto max-h-96 rounded-md mb-4"
              />
            )}
            {!selectedMeal && !isLoading && !error && (
              <p className="text-gray-500">No meal selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredient;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MealPlans = ({ user, setUser, cart, setCart }) => {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState([]);
  const [showInfo, setShowInfo] = useState({});

  useEffect(() => {
    // Initialize meal plans
    setMealPlans([
      {
        id: 1,
        tag: "protein",
        title: "High Protein Power",
        description:
          "For fitness lovers - who need fuel for workouts, recovery, and strength-building. Every meal is high in protein and balanced with whole ingredients to keep you full and energized. Whether you are training hard or just want to eat cleaner, this plan supports your goals.",
        mealsPerWeek: 5,
        freeDelivery: true,
        price: 110,
        quantity: 1,
      },
      {
        id: 2,
        tag: "balanced",
        title: "Balanced Boost",
        description:
          "A perfect mix of protein, fiber, and greens to keep your energy steady throughout the day. Each meal is crafted with whole foods that support focus, fullness, and overall wellness. Ideal for anyone looking to eat clean without sacrificing flavor or satisfaction.",
        mealsPerWeek: 5,
        freeDelivery: true,
        price: 120,
        quantity: 1,
      },
      {
        id: 3,
        tag: "vegetarian",
        title: "Veggie Delight",
        description:
          "A flavorful plant-based plan packed with nutrient-dense vegetables, grains, and legumes. It is designed for vegetarians and anyone wanting to eat more greens without compromising on taste. Expect colorful, wholesome meals that nourish and energize.",
        mealsPerWeek: 5,
        freeDelivery: true,
        price: 100,
        quantity: 1,
      },
      {
        id: 4,
        tag: "pescatarian",
        title: "Seafood Fresh",
        description:
          "features light, heart-healthy meals built around fresh fish, grains, and seasonal produce. It's perfect for those reducing red meat or looking to enjoy nutrient-rich seafood. Balanced and refreshing, this plan supports a clean, energizing lifestyle.",
        mealsPerWeek: 5,
        freeDelivery: true,
        price: 70,
        quantity: 1,
      },
    ]);
  }, []);

  const [mealsByTag, setMealsByTag] = useState({});

  // Fetch meals from backend for a given tag
  const fetchMealsForTag = async (tag, planId) => {
    try {
      const res = await axios.get(`/api/meals/tag/${tag}`);
      setMealsByTag((prev) => ({ ...prev, [planId]: res.data }));
    } catch (err) {
      console.error("Error fetching meals for plan:", err);
    }
  };

  // Handle selecting a plan -> adds to cart 
  const handleSelect = async (plan) => {
    if (!user) {
      alert("Please login first to add a meal plan to your cart.");
      navigate("/login");
      return;
    }

    const existingIndex = cart.findIndex((item) => item.title === plan.title);
    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      alert(
        `Quantity updated: ${plan.title} is now in your cart (${updatedCart[existingIndex].quantity})`
      );
    } else {
      // Plan not in cart → add with quantity 1
      updatedCart = [...cart, { ...plan, quantity: 1 }];
      alert(`${plan.title} has been added to your cart.`);
    }

    try {
      await axios.put(`http://localhost:8080/api/users/${user._id}/cart`, {
        cartItem:
          updatedCart[
            existingIndex !== -1 ? existingIndex : updatedCart.length - 1
          ],
      });

      setCart(updatedCart);
      setUser((prev) => ({ ...prev, cart: updatedCart }));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Toggle visibility of sample meals, fetch if not already loaded
  const toggleMoreInfo = (plan) => {
    setShowInfo((prev) => ({ ...prev, [plan.id]: !prev[plan.id] }));
    if (!mealsByTag[plan.id]) {
      fetchMealsForTag(plan.tag, plan.id);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans py-12 px-8">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-12">
        Explore Our Meal Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {mealPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 border rounded-xl shadow hover:shadow-lg transition border-gray-300"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {plan.title}
            </h2>
            <p className="text-gray-700 mb-4">{plan.description}</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>{plan.mealsPerWeek} meals per week</li>
              <li>
                {plan.freeDelivery
                  ? "Includes free delivery"
                  : "Delivery charges apply"}
              </li>
              <li>${plan.price}/week</li>
            </ul>
            <div className="space-x-3">
              <button
                onClick={() => handleSelect(plan)}
                className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
              >
                Select
              </button>
              <button
                onClick={() => toggleMoreInfo(plan)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                {showInfo[plan.id] ? "Hide Info" : "More Info"}
              </button>
            </div>

            {showInfo[plan.id] && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Sample Meals:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(mealsByTag[plan.id] || []).map((meal, idx) => (
                    <div
                      key={meal._id || idx}
                      className="bg-white border rounded p-3 shadow hover:shadow-md cursor-pointer"
                      onClick={() => navigate(`/meals/${meal._id}`)}
                    >
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h4 className="font-bold text-green-700">{meal.name}</h4>
                      <p className="text-sm text-gray-600">
                        {meal.ingredients?.slice(0, 3).join(", ") ||
                          "View Details"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlans;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = ({ cart, setCart, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch user's cart from the backend
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${user._id}/cart`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      setCart(Array.isArray(data.cart) ? data.cart : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load meals:", err);
      setError("Unable to load cart. Please try again.");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove one item from the cart
  const removeItemFromCart = async (index) => {
    setIsLoading(true);
    try {
      const itemId = cart[index].id;

      await axios.delete(
        `http://localhost:8080/api/users/${user._id}/cart/${itemId}`
      );
      const updatedCart = cart.filter((_, i) => i !== index); //remove locally
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Unable to remove item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity (increment or decrement)
  const updateQuantity = async (index, delta) => {
    const updatedCart = [...cart];
    const currentItem = updatedCart[index];
    const newQuantity = (currentItem.quantity || 1) + delta;

    if (newQuantity <= 0) {
      removeItemFromCart(index);
    } else {
      updatedCart[index] = { ...currentItem, quantity: newQuantity };
      setCart(updatedCart);

      try {
        await axios.put(
          `http://localhost:8080/api/users/${user._id}/cart/${currentItem.id}`,
          { quantity: newQuantity }
        );
      } catch (err) {
        console.error("Failed to update quantity:", err);
        setError("Unable to update quantity. Please try again.");
      }
    }
  };

  // Remove all items from cart
  const clearCart = async () => {
    const userId = typeof user._id === "string" ? user._id : user._id?.$oid;

    if (!user || !userId) {
      console.warn("Cannot clear cart: user or user._id is undefined.");
      setError("Cannot clear cart. User information missing.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}/cart`);
      setCart([]);
      setError(null);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear cart. Please try again.");
    }
  };

  // Fetch cart when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const total = Array.isArray(cart)
    ? cart.reduce(
        (acc, course) => acc + (course.price || 0) * (course.quantity || 1),
        0
      )
    : 0;
  const tax = total * 0.1;
  const combinedTotal = total + tax;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="border border-gray-300 p-5 rounded-lg shadow-sm bg-white transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-700 font-medium">
                  Price: ${item.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-medium">Qty: {item.quantity || 1}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-red-600 mt-2 hover:underline"
                  onClick={() => removeItemFromCart(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner text-gray-800">
          <p>Subtotal: ${total.toFixed(2)}</p>
          <p>Tax (10%): ${tax.toFixed(2)}</p>
          <p className="text-lg mt-2 font-bold">
            Total: ${combinedTotal.toFixed(2)}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => clearCart()}
            className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors font-semibold"
          >
            Clear Cart
          </button>

          <button
            onClick={() => cart.length > 0 && navigate("/payment")}
            className={`py-2 px-6 rounded text-white font-semibold transition ${
              cart.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={cart.length === 0}
          >
            Proceed to Payment
          </button>

          <button
            onClick={() => navigate("/mealPlans")}
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Summary = ({ cart, setCart, user, orderUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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

  const subtotal = cart.reduce((acc, item) => {
    const quantity = item.quantity || 1;
    return acc + item.price * quantity;
  }, 0);

  const TAX_RATE = 0.1;
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Order Summary</h2>

        {cart.length === 0 ? (
          <p className="text-center text-lg">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={index} className="border p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity || 1}</p>
                <p>
                  Total: $
                  {(
                    item.price * (item.quantity || 1) * TAX_RATE +
                    item.price * (item.quantity || 1)
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tax (10%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {orderUser && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-bold mb-2">Customer Information</h3>
            <p>{orderUser.name}</p>
            <p>{orderUser.email}</p>
            {orderUser.address && (
              <div className="mt-2">
                <p>{orderUser.address.street}</p>
                <p>
                  {orderUser.address.city}, {orderUser.address.state}{" "}
                  {orderUser.address.zip}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mt-10 flex ">
          <button
            onClick={() => {
              navigate("/");
              clearCart();
            }}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;

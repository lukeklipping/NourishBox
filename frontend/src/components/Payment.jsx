import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = ({ cart, setCart, setOrderUser }) => {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zip"].includes(name)) {
      setPaymentInfo((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const { name, email, cardNumber, expiryDate, cvc, address } = paymentInfo;

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address.";
    if (!address.street.trim())
      newErrors.street = "Street address is required.";
    if (!address.city.trim()) newErrors.city = "City is required.";
    if (!/^[A-Za-z]{2}$/.test(address.state.trim()))
      newErrors.state = "State must be 2 letters.";
    if (!/^\d{5}$/.test(address.zip.trim()))
      newErrors.zip = "ZIP code must be 5 digits.";
    if (!/^\d{16}$/.test(cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "Expiry must be in MM/YY format.";
    } else {
      const [month, year] = expiryDate.split("/").map(Number);
      const now = new Date();
      const expiry = new Date(`20${year}`, month - 1);
      if (expiry < now)
        newErrors.expiryDate = "Expiry date must be in the future.";
    }
    if (!/^\d{3}$/.test(cvc)) newErrors.cvc = "CVC must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      console.error("Validation failed");
      return;
    }
    const { name, email, address } = paymentInfo;
    setOrderUser({ name, email, address });
    alert("Payment successful!");
    navigate("/summary");
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const TAX_RATE = 0.1;
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans flex flex-col px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={paymentInfo.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={paymentInfo.email}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={paymentInfo.address.street}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street}</p>
          )}

          <input
            type="text"
            name="city"
            placeholder="City"
            value={paymentInfo.address.city}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <input
            type="text"
            name="state"
            placeholder="State (e.g., IA)"
            value={paymentInfo.address.state}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state}</p>
          )}

          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={paymentInfo.address.zip}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}

          <h2 className="text-xl font-bold mt-6 mb-2">Payment Details</h2>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber}</p>
          )}

          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry MM/YY"
            value={paymentInfo.expiryDate}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm">{errors.expiryDate}</p>
          )}

          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={paymentInfo.cvc}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}

          <button
            onClick={() => navigate("/cart")}
            className="bg-red-600 text-white px-6 py-2 rounded mt-4 hover:bg-red-700 mr-8"
          >
            Back to Cart
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
          >
            Submit Payment
          </button>
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Your Order</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>{item.title}</span>
              <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Tax (10%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

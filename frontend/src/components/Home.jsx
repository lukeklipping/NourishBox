import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const Home = ({ user, handleLogout }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/meals/gallery");
        setGalleryImages(res.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    fetchImages();
  }, []);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      <div className="px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-green-800 mb-4">
            Welcome to <span className="text-green-900">NourishBox</span>
          </h1>
          <p className="text-lg text-gray-700">
            Healthy, delicious meal plans delivered to your door. Select your plan and start nourishing your body!
          </p>
        </div>

        {/* Custom Carousel */}
        {galleryImages.length > 0 && (
          <div className="relative w-full max-w-4xl h-80 mx-auto mb-12 overflow-hidden rounded shadow border-4 border-green-300">
            <img
              src={galleryImages[index]?.imageUrl}
              alt={`Meal ${index + 1}`}
              className="w-full h-80 object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-y-0 left-0 flex items-center px-4">
              <button
                onClick={() => setIndex((index - 1 + galleryImages.length) % galleryImages.length)}
                className="bg-white/70 hover:bg-white/90 text-green-700 font-bold py-1 px-3 rounded-full shadow"
              >
                ◀
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4">
              <button
                onClick={() => setIndex((index + 1) % galleryImages.length)}
                className="bg-white/70 hover:bg-white/90 text-green-700 font-bold py-1 px-3 rounded-full shadow"
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {/* Why NourishBox Section */}
        <div className="mb-12 p-6 bg-yellow-100 rounded shadow-2xl hover:shadow-yellow-300 transition-shadow duration-300 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-yellow-900 mb-4">Why NourishBox?</h2>
          <p className="text-gray-800 text-left">
            NourishBox is more than just a meal delivery service—it's a lifestyle choice for those who value health, convenience, and flavor. Designed by certified nutritionists and chefs, our meal plans are tailored to fuel your day with balanced, nutrient-rich dishes made from fresh, locally sourced ingredients.
          </p>
          <p className="text-gray-800 text-left mt-4">
            Whether you're managing a busy schedule or simply looking to eat better without the hassle of meal prep, NourishBox empowers you to enjoy wholesome meals without compromise. Feel great every day with personalized plans, delicious recipes, and the confidence that your nutrition is being taken care of — all delivered straight to your door.
          </p>
        </div>

        {/* How to Get Started Section */}
        <div className="p-8 bg-green-100 rounded-xl shadow-2xl hover:shadow-green-200 transition-shadow duration-300 max-w-5xl mx-auto mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-green-800 mb-6">How to Get Started</h2>
          <div className="space-y-8 text-left">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <ClipboardDocumentListIcon className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-green-700">1. Browse our plans</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Compare plans based on your dietary goals and preferences.</li>
                  <li>Explore options like high-protein, low-carb, gluten-free, and vegan meals.</li>
                  <li>Choose the plan that fits your lifestyle and schedule.</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <UserPlusIcon className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-green-700">2. Sign up and log in</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Create your NourishBox account with your email and password.</li>
                  <li>Access your personalized dashboard to manage your meal plans.</li>
                  <li>Update your preferences, address, and delivery details at any time.</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <ShoppingCartIcon className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-green-700">3. Add meals and checkout</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Choose from a wide selection of chef-crafted meals each week.</li>
                  <li>Add meals to your shopping cart and view nutrition details.</li>
                  <li>Securely checkout and schedule your first delivery.</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <TruckIcon className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-green-700">4. Receive & enjoy</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Receive fresh meals packed with care and ready to eat or heat.</li>
                  <li>Follow simple reheating instructions and enjoy nutritious flavors.</li>
                  <li>Relax and feel confident knowing your health is a priority.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      {user && (
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MealPlans from "./components/MealPlans";
import Navbar from "./components/Navigation";
import AuthorPage from "./components/AuthorPage";
import Ingredient from "./components/Ingredient";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Summary from "./components/Summary";
import Profile from "./components/Profile";
import SearchResults from "./components/SearchResults";

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderUser, setOrderUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("nourishUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("nourishUser");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <Routes>
          <Route
            path="/"
            element={<Home user={user} handleLogout={handleLogout} />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/mealPlans" element={<MealPlans user={user} setUser={setUser} cart={cart} setCart={setCart}/>} />
          <Route path="/meals" element={<Ingredient />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
          <Route path="/payment" element={<Payment cart={cart} setCart={setCart} setOrderUser={setOrderUser}/>}/>
          <Route path="/summary" element={<Summary cart={cart} setCart={setCart} user={user} orderUser={orderUser}/>}/>
          <Route path="/authors" element={<AuthorPage />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} handleLogout={handleLogout}/>}/>
          <Route path="/meals/:id" element={<Ingredient />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

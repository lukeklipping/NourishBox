const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const usersCollection = db.collection("users");

  // Sign up
  router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    try {
      const existing = await usersCollection.findOne({ email });
      if (existing)
        return res.status(409).json({ error: "Email already exists." });

      const newUser = { name, email, password, cart: [] };
      await usersCollection.insertOne(newUser);
      res.status(201).json({ message: "User created", user: newUser });
    } catch (err) {
      res.status(500).json({ error: "Signup failed." });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields are required." });

    try {
      const user = await usersCollection.findOne({ email });
      if (!user || user.password !== password)
        return res.status(401).json({ error: "Invalid email or password." });

      res.status(200).json({ message: "Login successful", user });
    } catch (err) {
      res.status(500).json({ error: "Login failed." });
    }
  });

  // Update user
  router.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    delete updates._id;

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const updatedUser = await usersCollection.findOne({
        _id: new ObjectId(userId),
      });
      res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: "Failed to update user." });
    }
  });

  // Delete user
  router.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(userId),
      });

      if (result.deletedCount === 0)
        return res.status(404).json({ error: "User not found." });

      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user." });
    }
  });

  router.get("/users/:id/cart", async (req, res) => {
    const userId = req.params;
    try {
      const result = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { cart: 1, _id: 0 } } // only return cart
      );

      if (!result) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json({ cart: result.cart || [] }); // if empty, return empty
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user cart." });
    }
  });

  // Update user cart with selected meal plan
  router.put("/users/:id/cart", async (req, res) => {
    const { id } = req.params;
    const { cartItem } = req.body;
    console.log("cartItem", cartItem);

    if (!cartItem || !cartItem.title || !cartItem.price) {
      return res.status(400).json({ error: "Invalid cart item" });
    }

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingIndex = user.cart.findIndex(
        (item) => item.title === cartItem.title
      );

      if (existingIndex !== -1) {
        user.cart[existingIndex].quantity =
          (user.cart[existingIndex].quantity || 1) + 1;
      } else {
        cartItem.quantity = 1;
        user.cart.push(cartItem);
      }

      await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { cart: user.cart } }
      );

      const updatedUser = await usersCollection.findOne({
        _id: new ObjectId(id),
      });
      res.status(200).json({ message: "Cart updated", user: updatedUser });
    } catch (err) {
      console.error("Failed to update cart:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //update quantity
  router.put("/users/:id/cart/:mealId", async (req, res) => {
    const userId = req.params.id;
    const mealId = req.params.mealId;
    const { quantity } = req.body;

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId), "cart.id": parseInt(mealId) },
        { $set: { "cart.$.quantity": quantity } }
      );

      if (result.matchedCount === 0)
        return res.status(404).json({ error: "User or meal not found." });

      res.status(200).json({ message: "Cart updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update cart." });
    }
  });

  // remove from individual from cart
  router.delete("/users/:id/cart/:mealId", async (req, res) => {
    const userId = req.params.id;
    const mealId = req.params.mealId;

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { cart: { id: parseInt(mealId) } } }
      );
      console.log("result", result);

      if (result.matchedCount === 0)
        return res.status(404).json({ error: "User not found." });

      res.status(200).json({ message: "Item removed from cart." });
    } catch (err) {
      res.status(500).json({ error: "Failed to remove item from cart." });
    }
  });

  // remove all from cart
  router.delete("/users/:id/cart", async (req, res) => {
    const userId = req.params.id;

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { cart: [] } }
      );
      console.log("result", result);

      if (result.matchedCount === 0)
        return res.status(404).json({ error: "User not found." });

      res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
      res.status(500).json({ error: "Failed to clear cart." });
    }
  });

  return router;
};

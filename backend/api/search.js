const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Endpoint to search for meals by name
  router.get("/meals", async (req, res) => {
    let { searchTerm = "" } = req.query;
    try {
      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};
      const meals = await db.collection("meals").find(query).toArray();
      res.status(200).json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return router;
};

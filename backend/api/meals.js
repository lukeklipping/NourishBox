const express = require("express");
const axios = require("axios");
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const router = express.Router();
  const SPOON_API_KEY = "ac2fcc8d93b44126a03e4cf68ab50c21"; 

  // GET all meals
  router.get("/", async (req, res) => {
    try {
      const meals = await db.collection("meals").find({}).toArray();
      res.status(200).json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error.message);
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  });

  // GET random 5 meals with imageUrl
  router.get("/gallery", async (req, res) => {
    try {
      const meals = await db
        .collection("meals")
        .aggregate([
          { $match: { imageUrl: { $exists: true, $ne: null } } },
          { $sample: { size: 5 } },
        ])
        .toArray();
      res.status(200).json(meals);
    } catch (error) {
      console.error("Error fetching gallery meals:", error.message);
      res.status(500).json({ error: "Failed to fetch gallery meals" });
    }
  });

  // GET meal by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const meal = await db
        .collection("meals")
        .findOne({ _id: new ObjectId(id) });
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.status(200).json(meal);
    } catch (error) {
      console.error("Error fetching meal:", error.message);
      res.status(500).json({ error: "Failed to fetch meal" });
    }
  });

  // GET meals by tag (e.g., vegetarian, high-protein)
  router.get("/tag/:tag", async (req, res) => {
    const tag = req.params.tag.toLowerCase();

    try {
      const meals = await db.collection("meals")
        .find({ tags: { $elemMatch: { $regex: tag, $options: "i" } }, imageUrl: { $exists: true, $ne: null } })
        .limit(5)
        .toArray();

      res.status(200).json(meals);
    } catch (error) {
      console.error("Error fetching meals by tag:", error.message);
      res.status(500).json({ error: "Failed to fetch meals by tag" });
    }
  });


  // POST new meal manually
  router.post("/", async (req, res) => {
    const { name, calories, ingredients, tags, sourceUrl, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name and imageUrl" });
    }

    const meal = {
      name,
      calories: calories || null,
      ingredients: ingredients || [],
      tags: tags || [],
      sourceUrl: sourceUrl || null,
      imageUrl,
      createdAt: new Date(),
    };

    try {
      const result = await db.collection("meals").insertOne(meal);
      res.status(201).json({ insertedId: result.insertedId, meal });
    } catch (error) {
      console.error("Error adding meal:", error.message);
      res.status(500).json({ error: "Failed to add meal" });
    }
  });

  // GET /fetch/:id - Import specific spoon recipe
  router.get("/fetch/:id", async (req, res) => {
    const recipeId = req.params.id;

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: { apiKey: SPOON_API_KEY },
        }
      );

      const data = response.data;
      const meal = {
        name: data.title,
        calories:
          data.nutrition?.nutrients?.find((n) => n.name === "Calories")
            ?.amount || null,
        ingredients: data.extendedIngredients?.map((i) => i.name),
        tags: data.diets,
        sourceUrl: data.sourceUrl,
        imageUrl: data.image || null,
        createdAt: new Date(),
      };

      const result = await db.collection("meals").insertOne(meal);
      console.log("Inserted meal:", meal.name);

      res.status(200).json({ inserted: result.insertedId, meal });
    } catch (error) {
      console.error("Error fetching from Spoonacular:", error.message);
      res.status(500).json({ error: "Failed to fetch or insert meal" });
    }
  });

  return router;
};

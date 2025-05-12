const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const authorsCollection = db.collection("authors");

  //get authors
  router.get("/", async (req, res) => {
    try {
      const authors = await authorsCollection.find({}).toArray();

      if (!authors) {
        return res.status(404).json({ error: "Authors not found" });
      }
      res.status(200).json(authors);
    } catch (error) {
      console.error("Error fetching authors:", error.message);
      res.status(500).json({ error: "Failed to fetch authors" });
    }
  });

  return router;
};

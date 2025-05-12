const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

connectDB().then((db) => {
  const userRoutes = require("./api/users")(db);
  const mealRoutes = require("./api/meals")(db);
  const searchRoutes = require("./api/search")(db);
  const authorsRoutes = require("./api/authors")(db);

  app.use("/api", userRoutes);
  app.use("/api/meals", mealRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/authors", authorsRoutes);

  app.get("/", (req, res) => {
    res.send("NourishBox backend is live.");
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

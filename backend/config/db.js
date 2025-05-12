const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://lukusklipping:nourishbox@cluster0.dzdqezl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db("NourishDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;

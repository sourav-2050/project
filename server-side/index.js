 import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import serverless from "serverless-http";
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb+srv://sourav:Y0MdcKy5Qz2YouYr@cluster0.jmnuuto.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection = null;

// Helper function to get database collections securely in a serverless environment
async function getCollections() {
  if (!dbConnection) {
    await client.connect();
    dbConnection = client.db("myDatabase");
  }
  return {
    usersCollection: dbConnection.collection("users"),
    adminsCollection: dbConnection.collection("admins"),
  };
}

// --- API ROUTES ---

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Post user
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const { usersCollection } = await getCollections();

    const existingUser = await usersCollection.findOne({
      contact: user.contact,
      group: user.group,
      location: user.location,
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "This donor is already registered!",
      });
    }

    const result = await usersCollection.insertOne(user);
    res.send({
      success: true,
      message: "User added successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// Show users
app.get("/users", async (req, res) => {
  try {
    const { usersCollection } = await getCollections();
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch users" });
  }
});

// Admin login
app.post("/admin/login", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { adminsCollection } = await getCollections();

    const admin = await adminsCollection.findOne({ name, email, password });

    if (!admin) {
      return res.status(401).send({
        success: false,
        message: "Name, Email or Password is wrong!",
      });
    }

    res.send({
      success: true,
      message: "Admin login successful!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Login failed",
    });
  }
});

// User delete
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { usersCollection } = await getCollections();

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete user",
    });
  }
});

// Local listening fallback for development (won't run on Netlify)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

// Export serverless handler for Netlify
export const handler = serverless(app);
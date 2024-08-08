import express from "express";
import bodyParser from "body-parser";
import db from "./config.js"; // Ensure the path is correct and includes the file extension
import cors from "cors"; // Import the cors middleware

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// Endpoint to handle user registration
app.post("/register", async (req, res) => {
  const { name, lastName, email, password } = req.body;

  try {
    // Store user data in Firestore
    const userRef = db.collection("logindata").doc(email); // Using email as document ID
    await userRef.set({
      name,
      lastName,
      email,
      password
    });

    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import { db, FieldValue } from "./config.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(cors({
  origin: 'https://weatherapp-lilac-xi.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200, // For legacy browser support
}));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Endpoint to add a favorite location
app.post("/favorites", async (req, res) => {
  const { uuid, favoriteLocation, favoriteCountry, temp, description } = req.body;

  if (!uuid || !favoriteLocation || !favoriteCountry || !temp || !description) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const userRef = db.collection("favorites").doc(uuid);
    await userRef.set({
      favorites: FieldValue.arrayUnion({
        location: favoriteLocation,
        country: favoriteCountry,
        temp,
        description,
      }),
    }, { merge: true });

    res.status(200).send({ message: "Favorite added successfully" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).send({ message: "Error adding favorite", error: error.message });
  }
});

// Endpoint to delete a favorite location
app.delete("/favorites", async (req, res) => {
  const { uuid, favoriteLocation } = req.body;

  if (!uuid || !favoriteLocation) {
    return res.status(400).send({ message: "UUID and favorite location are required" });
  }

  try {
    const userRef = db.collection("favorites").doc(uuid);
    const doc = await userRef.get();

    if (doc.exists) {
      const favorites = doc.data().favorites || [];

      // Find the favorite location object to delete
      const favoriteToDelete = favorites.find((favorite) => favorite.location === favoriteLocation);

      if (favoriteToDelete) {
        // Remove the favorite location object from the array
        await userRef.update({
          favorites: FieldValue.arrayRemove(favoriteToDelete),
        });

        res.status(200).send({ message: "Favorite removed successfully" });
      } else {
        res.status(404).send({ message: "Favorite not found" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).send({ message: "Error removing favorite", error: error.message });
  }
});

// Endpoint to fetch all favorites for a user
app.get("/favorites", async (req, res) => {
  const { uuid } = req.query;

  if (!uuid) {
    return res.status(400).send({ message: "UUID is required" });
  }

  try {
    const userRef = db.collection("favorites").doc(uuid);
    const doc = await userRef.get();

    if (doc.exists) {
      const favorites = doc.data().favorites || [];
      res.status(200).send({
        favorites: favorites.map(favorite => ({
          location: favorite.location,
          country: favorite.country,
          temp: favorite.temp,
          description: favorite.description
        }))
      });
    } else {
      res.status(404).send({ favorites: [] });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).send({ message: "Error fetching favorites", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

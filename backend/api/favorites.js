import express from "express";
import bodyParser from "body-parser";
import { db, FieldValue } from "../config.js";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://weatherapp-lilac-xi.vercel.app/', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Endpoint to add a favorite location
app.post("/api/favorites", async (req, res) => {
  const { uuid, favoriteLocation, favoriteCountry, temp, description } = req.body;

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
    res.status(500).send({ message: "Error adding favorite" });
  }
});

// Endpoint to delete a favorite location
app.delete("/api/favorites", async (req, res) => {
  const { uuid, favoriteLocation } = req.body;

  try {
    const userRef = db.collection("favorites").doc(uuid);
    const doc = await userRef.get();
    const favorites = doc.data().favorites;

    const favoriteToDelete = favorites.find((favorite) => favorite.location === favoriteLocation);

    if (favoriteToDelete) {
      await userRef.update({
        favorites: FieldValue.arrayRemove(favoriteToDelete),
      });

      res.status(200).send({ message: "Favorite removed successfully" });
    } else {
      res.status(404).send({ message: "Favorite not found" });
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).send({ message: "Error removing favorite" });
  }
});

// Endpoint to fetch all favorites for a user
app.get("/api/favorites", async (req, res) => {
  const { uuid } = req.query;

  if (!uuid) {
    return res.status(400).send({ message: "UUID is required" });
  }

  try {
    const userRef = db.collection("favorites").doc(uuid);
    const doc = await userRef.get();

    if (doc.exists) {
      const favorites = doc.data().favorites || [];
      res.status(200).send({ favorites: favorites.map(favorite => ({
        location: favorite.location,
        country: favorite.country,
        temp: favorite.temp,
        description: favorite.description,
      })) });
    } else {
      res.status(404).send({ favorites: [] });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).send({ message: "Error fetching favorites" });
  }
});

export default app;

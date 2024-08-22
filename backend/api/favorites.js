import { db, FieldValue } from "../config.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Endpoint to add a favorite location
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
      res.status(200).json({ message: "Favorite added successfully" });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Error adding favorite" });
    }
  } else if (req.method === "DELETE") {
    // Endpoint to delete a favorite location
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
        res.status(200).json({ message: "Favorite removed successfully" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Error removing favorite" });
    }
  } else if (req.method === "GET") {
    // Endpoint to fetch all favorites for a user
    const { uuid } = req.query;
    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }
    try {
      const userRef = db.collection("favorites").doc(uuid);
      const doc = await userRef.get();
      if (doc.exists) {
        const favorites = doc.data().favorites || [];
        res.status(200).json({ favorites: favorites.map(favorite => ({
          location: favorite.location,
          country: favorite.country,
          temp: favorite.temp,
          description: favorite.description,
        })) });
      } else {
        res.status(404).json({ favorites: [] });
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Error fetching favorites" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

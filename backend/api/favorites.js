import { db, FieldValue } from "../config";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { uuid, favoriteLocation, favoriteCountry, temp, description } = req.body;
      if (!uuid || !favoriteLocation || !favoriteCountry || temp === undefined || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
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
    } else if (req.method === "DELETE") {
      const { uuid, favoriteLocation } = req.body;
      if (!uuid || !favoriteLocation) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const userRef = db.collection("favorites").doc(uuid);
      const doc = await userRef.get();
      const favorites = doc.data()?.favorites || [];
      const favoriteToDelete = favorites.find((favorite) => favorite.location === favoriteLocation);
      if (favoriteToDelete) {
        await userRef.update({
          favorites: FieldValue.arrayRemove(favoriteToDelete),
        });
        res.status(200).json({ message: "Favorite removed successfully" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } else if (req.method === "GET") {
      const { uuid } = req.query;
      if (!uuid) {
        return res.status(400).json({ message: "UUID is required" });
      }
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
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

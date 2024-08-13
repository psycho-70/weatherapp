import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../appContext';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

const Favorite = () => {
  const { favorites, darkMode, setFavorites, user } = useContext(AppContext);
  const toastIdRef = useRef(null);

  const fetchFavorites = async () => {
    if (!user?.uid) {
      toastIdRef.current = toast.error("Please log in to your account");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/favorites?uuid=${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (Array.isArray(result.favorites)) {
        setFavorites(result.favorites.filter(fav => fav && fav.location));
      } else {
        toastIdRef.current = toast.error('Invalid data structure received');
      }
    } catch (error) {
      toastIdRef.current = toast.error(`Failed to fetch favorites: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, setFavorites]);

  const handleDeleteFavorite = async (favoriteLocation) => {
    try {
      const response = await fetch('http://localhost:3000/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: user.uid,
          favoriteLocation,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toastIdRef.current = toast.error("Favorite not found");
        } else {
          throw new Error(`Failed to delete favorite: ${response.status} ${response.statusText}`);
        }
      }

      toastIdRef.current = toast.success('Favorite deleted successfully');

      // Refresh the favorites list
      fetchFavorites();
    } catch (error) {
      toastIdRef.current = toast.error(`Failed to delete favorite: ${error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [toastIdRef]);

  return (
    <div className={`p-5  min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-bold text-center mb-4">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-4">
          {favorites.map((favorite, index) => {
            if (favorite && favorite.location) {
              return (
                <li
                  key={index}
                  className="mb-2 flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow-md"
                >
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-800">
                      {favorite.location}
                    </h1>
                    <h2 className="text-sm text-gray-600">{favorite.country}</h2>
                    <h2 className="text-sm text-gray-600">{favorite.temp}°C</h2>
                    <h2 className="text-sm text-gray-500 italic">
                      {favorite.description}
                    </h2>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteFavorite(favorite.location)}
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </li>
              );
            } else {
              return null;
            }
          })}
        </ul>
      )}
    </div>
  );
};

export default Favorite;
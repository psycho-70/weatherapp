import React, { useContext, useEffect } from 'react';
import { AppContext } from '../appContext';
import { useSnackbar } from 'notistack';

const Favorite = () => {
  const { favorites, darkMode, setFavorites, user } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const fetchFavorites = async () => {
    if (!user?.uid) {
      enqueueSnackbar('Please create your account', { variant: 'warning' });
      return;
    }

    const response = await fetch(`https://weatherapp-backend-furqan-khans-projects.vercel.app/favorites?uuid=${user.uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (Array.isArray(result.favorites)) {
        setFavorites(result.favorites.filter(fav => fav && fav.location));
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, setFavorites]);

  const handleDeleteFavorite = async (favoriteLocation) => {
    if (!user) {
      enqueueSnackbar('Please log in to delete favorites', { variant: 'warning' });
      return;
    }

    const response = await fetch('https://weatherapp-backend-furqan-khans-projects.vercel.app/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: user.uid,
        favoriteLocation,
      }),
    });

    if (response.ok) {
      enqueueSnackbar('Favorite deleted successfully', { variant: 'success' });
      fetchFavorites(); // Refresh the favorites list
    } else {
      enqueueSnackbar('Failed to delete favorite', { variant: 'error' });
    }
  };

  return (
    <div className={`p-5 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-bold text-center mb-4">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {favorites.map((favorite, index) => {
            if (favorite && favorite.location) {
              return (
                <li
                  key={index}
                  className="mb-2 w-full md:w-1/4 flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow-md"
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
                  <button
                    onClick={() => handleDeleteFavorite(favorite.location)}
                    className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Delete
                  </button>
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

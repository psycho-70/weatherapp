import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import { Button } from '@mui/material';

const Favorite = () => {
  const { favorites, darkMode } = useContext(AppContext);

  return (
    <>

      <h1 className={`text-3xl p-3 font-bold text-center  ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>Favorite Weather Locations</h1>
    <div className={`p-4 flex flex-wrap min-h-[60vh] items-center md:justify-normal justify-center ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      {favorites.length === 0 ? (
        <p className="text-lg">No favorites added yet.</p>
      ) : (
        favorites.map((favorite, index) => (
          <div key={index} className={`p-4 m-3 rounded-lg  ${darkMode ? 'bg-gray-600 text-gray-100' : 'nav-co2 text-gray-900'}`}>
            <h2 className="text-xl font-semibold mb-2">
              {favorite.name}, {favorite.sys.country}
            </h2>
            <p className="text-lg mb-2">Temperature: {favorite.main.temp} °C</p>
            <p className="mb-2">Description: {favorite.weather[0].description}</p>
            <div className="flex mb-2">
              {favorite.weather[0].icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${favorite.weather[0].icon}.png`}
                  alt="Weather Icon"
                  className="w-12 h-12 mr-2"
                />
              )}
              <p className="text-lg">{favorite.weather[0].main}</p>
            </div>
           
           
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Favorite;

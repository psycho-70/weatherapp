import React, { useContext, useEffect, useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AppContext } from '../appContext';
import '../App.css';

const Section = () => {
  const { city, weatherData, getBackgroundImage, setFavorites, user, error, darkMode, fetchData } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar(); // Import the enqueueSnackbar function from notistack
  const [showToast, setShowToast] = useState(false);

  const handleAddFavorite = async () => {
    if (!user) {
      enqueueSnackbar('Please create your account', { variant: 'error' });
      return;
    }

    try {
      const response = await fetch('https://weatherapp-backend-furqan-khans-projects.vercel.app/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: user.uid,
          favoriteLocation: weatherData.name,
          favoriteCountry: weatherData.sys.country,
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }
      
      enqueueSnackbar('Added to Favorite.', { variant: 'success' });

      const result = await response.json();
      setFavorites(prevFavorites => [...prevFavorites, result.favoriteLocation]);
      console.log(result);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  }

  useEffect(() => {
    if (showToast) {
      enqueueSnackbar('Failed to fetch weather data. Please try again later.', { variant: 'error' });
      setShowToast(false);
    }
  }, [showToast, enqueueSnackbar]);

  useEffect(() => {
    if (city) {
      // Only fetch data if weatherData is not already available
      if (!weatherData || weatherData.name !== city) {
        fetchData(city).catch(() => setShowToast(true));
      }
    }
  }, [city, fetchData, weatherData]);

  
  

  return (
    <div className={`flex flex-col items-center justify-center ${getBackgroundImage()} ${darkMode ? 'dark' : ''}`}>
      <div className={`m-5 p-6 rounded-lg h-[80vh] w-full md:w-2/3 lg:w-1/2 ${darkMode ? 'bg-opacity-30 bg-gray-800 text-white' : 'bg-opacity-30 bg-gray-800 text-white'}`}>
        <div className='flex w-full items-center justify-between'>
          <h1 className=" text-2xl md:text-3xl font-bold mb-4">Weather Data</h1>
          <button
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleAddFavorite}>Add Favorite</button>
        </div>
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
        {weatherData ? (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-lg md:text-xl mb-2">Temperature: {weatherData.main.temp} °C</p>
            <p className="mb-2 text-lg md:text-xl">Description: {weatherData.weather[0].description}</p>
            <div className="flex items-center text-lg md:text-xl mb-2">
              {weatherData.weather[0].icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                  alt="Weather Icon"
                  className="w-12 h-12 mr-2"
                />
              )}
              <p className="text-lg">{weatherData.weather[0].main}</p>
            </div>
            <div className="grid grid-cols-2 md:gap-6 gap-10">
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-1">Coordinates</h3>
                <p className='text-[15px] md:text-lg'>Latitude: {weatherData.coord.lat}</p>
                <p className='text-[15px] md:text-lg'>Longitude: {weatherData.coord.lon}</p>
              </div> 
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-1">Wind</h3>
                <p className='text-[15px] md:text-lg'>Speed: {weatherData.wind.speed} m/s</p>
                <p className='text-[15px] md:text-lg'>Direction: {weatherData.wind.deg}°</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-1">Main</h3>
                <p className='text-[15px] md:text-lg'>Feels Like: {weatherData.main.feels_like} °C</p>
                <p className='text-[15px] md:text-lg'>Humidity: {weatherData.main.humidity}%</p>
                <p className='text-[15px] md:text-lg'>Pressure: {weatherData.main.pressure} hPa</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-1">Additional Info</h3>
                <p className='text-[15px] md:text-lg'>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p className='text-[15px] md:text-lg'>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                <p className='text-[15px] md:text-lg'>Visibility: {weatherData.visibility} meters</p>
              </div>
            </div>
          </div>
        ) : (
          !error && <p className="text-lg">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Section />
    </SnackbarProvider>
  );
}

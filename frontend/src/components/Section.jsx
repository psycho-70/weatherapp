import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../appContext';
import '../App.css';
// import { RemoveShoppingCartRounded } from '@mui/icons-material';

const Section = () => {
  const { city, weatherData, addFavorite,setFavorites, user, error, darkMode, fetchData } = useContext(AppContext);
  const [showToast, setShowToast] = useState(false);
  // const [favorites, setFavorites] = useState([]);

  const handleAddFavorite = async () => {
    if (!user) {
      toast.error('please create you account');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: user.uid, // Ensure this is the correct field for UUID
          favoriteLocation: weatherData.name,
          favoriteCountry: weatherData.sys.country,
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }
  
      const result = await response.json();
      setFavorites(prevFavorites => [...prevFavorites, result.favoriteLocation]);
      console.log(result);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  }

  useEffect(() => {
    if (showToast) {
      toast.error('Failed to fetch weather data. Please try again later.');
      setShowToast(false); // Hide toast after showing
    }
  }, [showToast]);

  useEffect(() => {
    if (city) {
      fetchData(city).catch(() => setShowToast(true));
    }
  }, [city]);

  const getBackgroundImage = () => {
    if (!weatherData) return '';

    const weatherMain = weatherData.weather[0].main.toLowerCase();
    if (weatherMain.includes('rain')) return 'rain-bg';
    if (weatherMain.includes('cloud')) return 'cloud-bg';
    if (weatherMain.includes('clear')) return 'sunny-bg';
    return '';
  };

  return (
    <>
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
        <ToastContainer />
      </div>
    </>
  );
};

export default Section;

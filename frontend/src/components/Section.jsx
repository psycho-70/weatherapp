import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../appContext';
import '../App.css';
import { Button } from '@mui/material';

const Section = () => {
  const { city, weatherData, error, darkMode, fetchData , addFavorite } = useContext(AppContext);
  const [showToast, setShowToast] = useState(false);

  const handleAddFavorite = () => {
    if (weatherData) {
      addFavorite(weatherData);
      toast.success('Added to favorites!');
    }
  };

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
        <div className={`m-5 p-6 rounded-lg h-[80vh] w-full md:w-2/3 lg:w-1/2 ${darkMode ? 'bg-opacity-30 bg-gray-800 text-white' : 'bg-opacity-30 bg-gray-800  text-white'}`}>
        <div className='flex w-full items-center justify-between'>
            <h1 className="text-3xl font-bold mb-4">Weather Data</h1>
            <Button sx={{ margin: "0px 10px" }} variant='contained' onClick={handleAddFavorite}>Add</Button>
          </div>
          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}
          {weatherData ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-lg mb-2">Temperature: {weatherData.main.temp} °C</p>
              <p className="mb-2">Description: {weatherData.weather[0].description}</p>
              <div className="flex mb-2">
                {weatherData.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                    alt="Weather Icon"
                    className="w-12 h-12 mr-2"
                  />
                )}
                <p className="text-lg">{weatherData.weather[0].main}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Coordinates</h3>
                  <p>Latitude: {weatherData.coord.lat}</p>
                  <p>Longitude: {weatherData.coord.lon}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Wind</h3>
                  <p>Speed: {weatherData.wind.speed} m/s</p>
                  <p>Direction: {weatherData.wind.deg}°</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Main</h3>
                  <p>Feels Like: {weatherData.main.feels_like} °C</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                  <p>Pressure: {weatherData.main.pressure} hPa</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Additional Info</h3>
                  <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                  <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                  <p>Visibility: {weatherData.visibility} meters</p>
                </div>
              </div>
            </div>
          ) : (
            !error && <p className="text-lg">Loading...</p>
          )}
        </div>
        {/* {showToast && <ToastContainer />} Render ToastContainer conditionally */}
      </div>
    </>
  );
};

export default Section;

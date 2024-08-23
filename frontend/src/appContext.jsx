import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth, signInWithProvider, googleProvider, githubProvider, signOutUser } from "./firebase"; // Update the import path

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [airQualityData, setAirQualityData] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  const addFavorite = (favorite) => {
    setFavorites((prevFavorites) => [...prevFavorites, favorite]);
  };

  const fetchData = async (city) => {
    if (city.trim() === '') {
      return "";
    }

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setWeatherData(responseData);
      setError(null);
      

      // Fetch hourly data based on the coordinates
      fetchHourlyData(responseData.coord.lat, responseData.coord.lon);
      // Fetch air quality data based on the coordinates
      fetchAirQualityData(responseData.coord.lat, responseData.coord.lon);
    } catch (error) {
      setWeatherData(null);
      setError('Please make sure you have no typing mistakes and maybe you entered the wrong city name.');
    }
  };

  const fetchHourlyData = async (lat, lon) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setHourlyData(responseData.list.slice(0, 12)); // Fetch next 12 hours
      
    } catch (error) {
      setHourlyData([]);
      setError('Failed to fetch hourly data.');
    }
  };

  const fetchAirQualityData = async (lat, lon) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please check your API key and subscription plan.');
        } else {
          setError('Network response was not ok');
        }
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setAirQualityData(responseData); // Set the air quality data
    
    } catch (error) {
      setAirQualityData(null);
      setError('Failed to fetch air quality data.');
    }
  };

  const getBackgroundImage = () => {
    if (!weatherData) return '';

    const weatherMain = weatherData.weather[0].main.toLowerCase();
    if (weatherMain.includes('rain')) return 'rain-bg';
    if (weatherMain.includes('cloud')) return 'cloud-bg';
    if (weatherMain.includes('clear')) return 'sunny-bg';
    return '';
  };

  // Automatically switch between dark and light mode based on the user's local time
  const handleDarkMode = () => {
    const currentHour = new Date().getHours(); // Get the current hour in the user's local time

    // Enable dark mode during night hours (e.g., between 7 PM and 6 AM)
    if (currentHour >= 19 || currentHour < 6) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };

  useEffect(() => {
    fetchData(city); // Initial fetch when component mounts
  }, [city]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleDarkMode(); // Check the time and set dark mode accordingly
  }, []); // Run only once when the component mounts

  return (
    <AppContext.Provider value={{
      city, setCity, weatherData, hourlyData, setFavorites, favorites, airQualityData, error, darkMode, setDarkMode, fetchData, getBackgroundImage, user, signInWithProvider, googleProvider, githubProvider, signOutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

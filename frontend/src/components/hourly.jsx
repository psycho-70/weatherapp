import React, { useContext } from 'react';
import { AppContext } from '../appContext';

const Hourly = () => {
  const { hourlyData, weatherData, darkMode, getBackgroundImage } = useContext(AppContext);

  return (
    <div className={`flex h-full flex-col items-center ${getBackgroundImage()} ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl text-white font-bold mb-4">Hourly Weather Data</h1>
      {hourlyData.length > 0 ? (
        <div className=" justify-center flex flex-wrap gap-3 py-5 md:gap-10 items-center">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-30 text-white rounded-full shadow-md p-4 flex flex-col items-center justify-center w-40 h-40"
            >
              <p className="text-sm font-semibold">
                {new Date(hour.dt * 1000).toLocaleTimeString()}
              </p>
              <p className="text-xl font-bold">{hour.main.temp}°C</p>
              <p className="text-sm capitalize">{hour.weather[0].description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hourly data available</p>
      )}
    </div>
  );
};

export default Hourly;

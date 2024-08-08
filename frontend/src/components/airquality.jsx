import React, { useContext, useEffect } from 'react';
import { AppContext } from '../appContext'; // Update path as needed

const AirQuality = () => {
  const { city, airQualityData, fetchData, darkMode, getBackgroundImage } = useContext(AppContext);

  useEffect(() => {
    fetchData(city); // This fetches the data including air quality data
  }, [city]);

  if (!airQualityData) return <div>Loading...</div>;

  const backgroundImageClass = getBackgroundImage();

  return (
    <div className={` min-h-[61.5vh] ${darkMode ?  ' bg-opacity-30 bg-gray-900 text-white' : 'bg-opacity-30 bg-white text-white'} ${backgroundImageClass}`}>
      <div className="container mx-auto py-8">
        <div className=" dark:bg-gray-800 rounded-lg mx-auto w-[50%] shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Air Quality</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="card">
              <p className="font-semibold">Air Quality Index: {airQualityData.list[0].main.aqi}</p>
            </div>
            <div className="card">
              <p>CO: {airQualityData.list[0].components.co} µg/m³</p>
            </div>
            <div className="card">
              <p>NO: {airQualityData.list[0].components.no} µg/m³</p>
            </div>
            <div className="card">
              <p>NO2: {airQualityData.list[0].components.no2} µg/m³</p>
            </div>
            <div className="card">
              <p>O3: {airQualityData.list[0].components.o3} µg/m³</p>
            </div>
            <div className="card">
              <p>SO2: {airQualityData.list[0].components.so2} µg/m³</p>
            </div>
            <div className="card">
              <p>PM2.5: {airQualityData.list[0].components.pm2_5} µg/m³</p>
            </div>
            <div className="card">
              <p>PM10: {airQualityData.list[0].components.pm10} µg/m³</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;

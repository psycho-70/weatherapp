import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Section from './components/Section';
import Hourly from './components/hourly';
import Blog from './components/blog';
import AirQuality from './components/airquality';
import Favorite from './components/favorite';
import About from './components/about';
import Login from './components/login';
import Footer from './components/Footer';
import BlogPost from './components/blogpost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
 
  return (
   <>
        <Navbar />
  <Routes>
        <Route path="/" element={<Section />} />
        <Route path="/hourly" element={<Hourly />} />
        <Route path="/airquality" element={<AirQuality />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
        <Footer />
    </>
  );
};

export default App;

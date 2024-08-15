import React, { useContext } from 'react';
import { FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdOutlineFacebook } from 'react-icons/md';
import { AppContext } from '../appContext'; // Update the path as needed

const Footer = () => {
  const { darkMode } = useContext(AppContext);

  return (
    <>
      <div className={`h-[1px] ${darkMode ? 'bg-white' : 'bg-black'} w-full`}></div>
      <footer className={`w-full h-full p-4 ${darkMode ? 'bg-gray-800 text-white' : 'nav-co2 text-black'}`}>
      <div className="w-full gap-3 md:flex justify-evenly items-center">
        <div className="h-20 text-center w-full md:w-1/3">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex items-center justify-center gap-5 p-2">
            <a href="https://web.facebook.com/furqan.don.771/" className="hover:text-gray-400"><MdOutlineFacebook /></a>
            <a href="https://twitter.com/?lang=en" className="hover:text-gray-400"><FaTwitter /></a>
            <a href="https://www.instagram.com/furqankhan070/" className="hover:text-gray-400"><FaInstagram /></a>
          </div>
        </div>
        <div className="h-20 flex flex-col md:gap-0 gap-3 text-center w-full md:w-1/3">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-sm">Email: furqanktk52@gmail.com</p>
          <p className="text-sm">Phone: +923141868872</p>
        </div>
        <div className="h-20 flex items-center justify-center w-full text-center pt-5 md:pt-0 md:w-1/3">
          <p className="">&copy; 2024 Weather-APP. All rights reserved.</p>
        </div>
      </div>
      
    </footer>
    </>
  );
};

export default Footer;

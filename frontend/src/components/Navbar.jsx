import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../appContext';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Autocomplete, Menu, MenuItem, IconButton, Drawer } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { onAuthStateChanged } from "firebase/auth";
import { FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdOutlineFacebook } from 'react-icons/md';

const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent('#fff')}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Navbar = () => {
  const { setCity, fetchData, darkMode, setDarkMode, user, signOutUser } = useContext(AppContext);
  const [value, setValue] = useState('1');
  const [valueIn, setValueIn] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width: 960px)');
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue === '1' ? '/' : newValue === '2' ? '/hourly' : newValue === '3' ? '/blog' : '/airquality');
    fetchData(valueIn, newValue === '1' ? 'current' : newValue === '2' ? 'hourly' : newValue === '3' ? 'blog' : 'airQuality');
  };

  const handleClear = () => {
    setValueIn('');
    setCity('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valueIn.trim() === '') {
      toast.error('Search field cannot be empty!');
    } else {
      setCity(valueIn);
      fetchData(valueIn, value === '1' ? 'current' : value === '2' ? 'hourly' : value === '3' ? 'blog' : 'airQuality');
    }
  };

  const fetchCitySuggestions = debounce(async (inputValue) => {
    if (inputValue.length > 0) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: inputValue,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
        });
        const suggestions = Array.from(new Set(response.data.map(city => city.display_name)));
        setCitySuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      }
    } else {
      setCitySuggestions([]);
    }
  }, );

  useEffect(() => {
    fetchCitySuggestions(valueIn);
  }, [valueIn]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setUserMenuAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    handleMenuClose();
  };

  return (
    <>
      <header className={`flex p-2 items-center space-x-12 justify-between md:justify-evenly mx-auto w-full ${darkMode ? 'bg-gray-800 text-white' : 'nav-co text-black'}`}>
        <div className=" ">
          <Link to="/">
          <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    width="60"
    height="60"
    fill="currentColor"
  >
    <circle cx="12" cy="12" r="5" fill="#FFD700">
      <animate
        attributeName="r"
        values="5;6;5"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
    <g stroke="#FFD700" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="23" />
      <line x1="1" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="23" y2="12" />
      <line x1="4.5" y1="4.5" x2="6.5" y2="6.5" />
      <line x1="17.5" y1="17.5" x2="19.5" y2="19.5" />
      <line x1="4.5" y1="19.5" x2="6.5" y2="17.5" />
      <line x1="17.5" y1="6.5" x2="19.5" y2="4.5" />
    </g>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 12 12"
      to="360 12 12"
      dur="5s"
      repeatCount="indefinite"
    />
  </svg>
          </Link>
        </div>
        <div className="flex">
        <form onSubmit={handleSubmit} className="flex items-center">
      {/* Search Icon for Mobile */}
      {!searchVisible && (
        <IconButton
          onClick={() => setSearchVisible(true)}
          className="md:hidden"
          style={{ color: darkMode ? '#fff' : '#000' }}
        >
          <IoSearchOutline />
        </IconButton>
      )}

      {/* Search Bar */}
      {searchVisible && (
        <Autocomplete
          freeSolo
          className="w-40 md:w-72 flex-grow"
          options={citySuggestions}
          inputValue={valueIn}
          onInputChange={(event, newInputValue) => {
            setValueIn(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              InputLabelProps={{ style: { color: darkMode ? '#fff' : '#000' } }}
              InputProps={{
                ...params.InputProps,
                style: {
                  backgroundColor: darkMode ? '#333' : '#fff',
                  color: darkMode ? '#fff' : '#000',
                  padding: '8px 0px',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {valueIn && (
                      <IconButton
                        onClick={handleClear}
                        style={{
                          color: darkMode ? '#fff' : '#000',
                          backgroundColor: darkMode ? '#333' : '#f5f5f5',
                          borderRadius: '50%',
                          padding: '8px',
                          transition: 'background-color 0.3s, color 0.3s',
                        }}
                      >
                        <IoCloseOutline />
                      </IconButton>
                    )}
                    <button type="submit" className="ml-2 bg-white rounded-full p-3">
                      <IoSearchOutline />
                    </button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}

      
    </form>
        </div>
        <div >
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="bottom"
                open={menuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: '70%',
                    height: '100%',
                    backgroundColor: darkMode ? '#2d3748' : 'rgb(237, 125, 49);', // Replace '#yourDefaultColor' with your default color
                    color: darkMode ? '#ffffff' : '#000000', // Replace '#000000' with your default color
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  {user ? (
                   <div className="relative flex gap-3">
                    <img
        src={user.photoURL ? user.photoURL : "/user.gif"}
        alt="User Avatar"
        className={`w-10 h-10 rounded-full cursor-pointer ${darkMode ? 'dark:filter dark:brightness-75' : ''}`}
        onClick={handleUserMenuOpen}
      />
                      <button
                        className='text-white bg-gradient-to-r from-white/10 via-white/20 to-white/30 backdrop-blur-md hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-white/50 dark:focus:ring-white/80 shadow-lg shadow-white/50 dark:shadow-lg dark:shadow-white/70 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                        onClick={handleSignOut}>Logout</button>
                      <Menu
                        anchorEl={userMenuAnchorEl}
                        open={Boolean(userMenuAnchorEl)}
                        onClose={handleMenuClose}
                      >
                      </Menu>
                    </div>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/favorite">Favorite</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/about">About us</Link>
                </MenuItem>
                <MenuItem onClick={toggleDarkMode}>
                  <FormControlLabel control={<DarkModeSwitch checked={darkMode} />} label="Dark Mode" />
                </MenuItem>
                <div className="flex justify-center items-center absolute bottom-0 gap-5 p-2">
                <h3 className="text-lg  font-semibold">Follow Us</h3>
            <a href="https://web.facebook.com/furqan.don.771/" className="hover:text-gray-400"><MdOutlineFacebook /></a>
            <a href="https://twitter.com/?lang=en" className="hover:text-gray-400"><FaTwitter /></a>
            <a href="https://www.instagram.com/furqankhan070/" className="hover:text-gray-400"><FaInstagram /></a>
          </div>
              </Drawer>
            </>
          ) : (
            <ul className={`flex items-center gap-5 text-lg`}>
              <li>
                <FormGroup>
                  <FormControlLabel
                    control={<DarkModeSwitch sx={{ m: 1 }} checked={darkMode} onChange={toggleDarkMode} />}
                    label=""
                  />
                </FormGroup>
              </li>
              <li>
                <Link to="/favorite">Favorite</Link>
              </li>
              <li>
                <Link to="/about">About us</Link>
              </li>
              {user ? (
                <li>
                 <div className="flex gap-4 relative">
  <img 
    src={user.photoURL ? user.photoURL : "/user.gif"}
    alt="User Avatar"
    className={`w-10 h-10 rounded-full cursor-pointer ${!user.photoURL && darkMode ? 'invert' : ''}`}
    onClick={handleUserMenuOpen}
  />

                    <button
                      className='text-white bg-gradient-to-r from-white/10 via-white/20 to-white/30 backdrop-blur-md hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-white/50 dark:focus:ring-white/80 shadow-lg shadow-white/50 dark:shadow-lg dark:shadow-white/70 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'

                      onClick={handleSignOut}>Logout</
                    button>

                  </div>
                </li>
              ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          )}
        </div>
      </header>
      <nav className="flex md:justify-center nav-co2">
        <TabContext value={value}>
          <Box sx={{
            borderBottom: 1, borderColor: 'divider'
          }}>
            <TabList
              onChange={handleChange}
              aria-label="weather tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                padding: { xs: 0, md: 0 },
                '& .MuiTab-root': {
                  padding: { xs: 1.8, md: 2 },
                  minWidth: 'auto',
                },
              }}
            >
              <Tab label={<Link to="/">Today</Link>} value="1" />
              <Tab label={<Link to="/hourly">Hourly</Link>} value="2" />
              <Tab label={<Link to="/airquality">Air Quality</Link>} value="4" />
              <Tab label={<Link to="/blog">Blog</Link>} value="3" />
            </TabList>
          </Box>
        </TabContext>
      </nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;

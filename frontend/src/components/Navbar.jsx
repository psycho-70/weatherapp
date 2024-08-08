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
import { Autocomplete, Menu, MenuItem, IconButton } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import debounce from 'lodash.debounce';

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
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
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
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Navbar = () => {
  const { setCity, fetchData, darkMode, setDarkMode,user, signOutUser } = useContext(AppContext);
  const [value, setValue] = useState('1');
  const [valueIn, setValueIn] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null); // State for user menu
  const isMobile = useMediaQuery('(max-width: 960px)');
  const navigate = useNavigate(); // Initialize navigate

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
  }, 300);

  useEffect(() => {
    fetchCitySuggestions(valueIn);
  }, [valueIn]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setUserMenuAnchorEl(null);
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
        <div className="text-lg md:text-3xl font-bold">
          <Link to="/"><img className='backdrop-invert-0' width={50} height={50} src="./sun.gif" alt="" /></Link>
        </div>
        <div className="flex">
          <form onSubmit={handleSubmit} className="flex items-center">
            <Autocomplete
              freeSolo
              className="w-40 md:w-72"
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
                      padding: "8px 0px" /* Vertical padding only */
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        {valueIn && (
                          <IconButton onClick={handleClear}>
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
          </form>
        </div>
        <div>
          
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/favorite">Favorite</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/about">About us</Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/login">Login</Link>
                </MenuItem>
                <MenuItem onClick={toggleDarkMode}>
                  <FormControlLabel control={<DarkModeSwitch checked={darkMode} />} label="Dark Mode" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <ul className="flex items-center gap-5">
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
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          )}
        </div>
      </header>
      <nav className="flex md:justify-center nav-co2">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
<Tab label={<Link to="/airquality">air Quality</Link>} value="4" />
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

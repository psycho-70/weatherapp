import React, { useContext } from 'react';
import { AppContext } from '../appContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const About = () => {
  const { darkMode } = useContext(AppContext);

  return (
    <div className={`flex min-h-screen flex-col md:flex-row items-center md:items-start p-4 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="w-full md:w-1/3 p-4">
        <img src="/profilepic-in-cv.jpg" alt="Furqan's Picture" className="rounded-lg w-full h-auto" />
      </div>
      <div className="w-full md:w-2/3 p-4">
        <Accordion className="w-full mb-4">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h6">About Weather App</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Welcome to the Weather App! This app provides accurate and up-to-date weather information 
              for cities around the world. With features such as hourly forecasts, air quality data, and 
              real-time weather updates, you'll always be prepared for whatever the weather brings.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="w-full mb-4">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="h6">About Me</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Hi, I'm Furqan, the creator of this Weather App. I am a passionate web developer with a 
              Bachelor's degree in Software Engineering. I specialize in building applications using 
              the MERN stack and enjoy creating user-friendly and efficient solutions to real-world 
              problems.
            </Typography>
            <Typography variant="body1" className="mt-4">
              In addition to my technical skills, I have experience in various computer-related tasks 
              such as using MS Office and troubleshooting computer problems. I'm always eager to learn 
              new technologies and improve my skills.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="w-full mb-4">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography variant="h6">Location</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="w-full h-96 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30378.36522515541!2d71.01520128464325!3d33.05255584140007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1722931693491!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default About;

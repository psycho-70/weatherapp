import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from '../appContext'; // Update path as needed

const Blog = () => {
  const { darkMode, getBackgroundImage } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
        const res = await fetch(`https://newsapi.org/v2/everything?q=technology&apiKey=${apiKey}`);
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        const result = await res.json();
        console.log('Fetched data:', result);
        if (result.status === "error") {
          throw new Error(result.message);
        }
        setData(result.articles || []);
      } catch (error) {
        setError(error.message);
      }
    };
    
    fetchData();
  }, []);
  
  const backgroundImage = getBackgroundImage();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-slate-300 text-black'} ${backgroundImage}`}>
      <h1 className="text-2xl font-bold p-4 text-white text-center">BlogPost</h1>
      {error ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {data.length > 0 ? (
            <div className="min-h-screen flex flex-wrap gap-3 p-3 justify-evenly">
              {data.filter(article => article.urlToImage && article.title && article.description).map((article, index) => (
                <div className={` w-full md:w-1/5 border m-2 rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 text-white' : 'nav-co2 text-black'}`} key={index}>
                  <img className="w-full h-52 object-cover" src={article.urlToImage} width={200} height={100} alt="" />
                  <h2 className="text-center h-14 p-2">{`${article.title.slice(0, 50)} ...`}</h2>
                  <p className="text-sm text-center h-24 p-3">{`${article.description.slice(0, 100)} ...`}</p>
                  <Link to={`/blog/${encodeURIComponent(article.title)}?id=${encodeURIComponent(article.title)}`}>
                    <button
                      type="button"
                      className='text-white m-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                    >
                      Read More
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-screen w-full flex justify-center items-center">
              <div className="loading lds-hourglass"></div>
            </div>
          )}
        </>
      )}
      <div className="h-[1px] bg-white w-full"></div>
    </div>
  );
};

export default Blog;

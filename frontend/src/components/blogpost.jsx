import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../appContext';

const BlogPost = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const { darkMode,getBackgroundImage } = useContext(AppContext);
  const backgroundImageClass = getBackgroundImage()
  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;

      const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(id)}&apiKey=${apiKey}`);
      const data = await res.json();
      setArticle(data.articles[0]);
    };

    fetchArticle();
  }, [id]);

  if (!article) return (
    <div className={`min-h-screen mt-10 ${darkMode ? 'bg-slate-800' : 'bg-white'} w-full flex justify-center items-center`}>
    </div>
  );

  let content = (article.description ? article.description : '') + ' ' + (article.content ? article.content.split(' [+')[0] : '');
  content = content.length > 1000 ? content.slice(0, 1000) : content;

  return (
    <>
      
      <div className={`p-6  ${darkMode ? 'bg-slate-800 text-white' : ' text-black bg-white'} ${backgroundImageClass}`}>
        <h1 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>{article.title}</h1>
        {article.urlToImage && (
          <div className='w-full flex justify-center items-center'>
            <img className="w-full rounded-2xl md:w-1/3 h-auto object-cover mb-4" src={article.urlToImage} alt={article.title} />
          </div>
        )}
        <div className='w-full flex justify-center items-center'>
          <p className={`text-lg text-center w-full md:w-1/2 ${darkMode ? 'text-white' : 'text-black'}`}>{content}</p>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
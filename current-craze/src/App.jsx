import React, { useState, useEffect } from 'react';
import './App.css';
import Logo from "./assets/Logo.png";

const API_KEY = import.meta.env.VITE_API_KEY;
const url = "https://newsapi.org/v2/everything?q=";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('India');
  const [curSelectedNav, setCurSelectedNav] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchNews(query);
  }, [query]);

  const fetchNews = async (query) => {
    try {
      const res = await fetch(`http://localhost:5000/api/news?q=${query}`);
      const data = await res.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchText = document.getElementById('search-text').value;
    setQuery(searchText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const onNavItemClick = (id) => {
    setQuery(id);
    setCurSelectedNav(id);
    setMenuOpen(false); // Close menu on navigation item click
  };

  const reload = () => {
    window.location.reload();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <nav>
        <div className="main-nav container flex">
          <a href="#" onClick={reload} className="company-logo">
            <img src={Logo} alt="company logo" />
          </a>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <ul className="flex">
              <NavItem id="India latest" label="Home" onClick={onNavItemClick} curSelectedNav={curSelectedNav} />
              <NavItem id="Latest Technology" label="Technology" onClick={onNavItemClick} curSelectedNav={curSelectedNav} />
              <NavItem id="latest Finance" label="Finance" onClick={onNavItemClick} curSelectedNav={curSelectedNav} />
              <NavItem id="India Sports" label="Sports" onClick={onNavItemClick} curSelectedNav={curSelectedNav} />
              <NavItem id="India Today weather" label="Weather" onClick={onNavItemClick} curSelectedNav={curSelectedNav} />
            </ul>
          </div>
          <div className="search-bar flex">
            <input id="search-text" type="text" className="news-input" placeholder="e.g. Science" onKeyDown={handleKeyDown} />
            <button id="search-button" className="search-button" onClick={handleSearch}>Search</button>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
        </div>
      </nav>
      <WeatherWidget />
      <TradingViewWidget />
      <main>
        <div className="cards-container container flex" id="cards-container">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
};

const LoadingScreen = () => (
  <div id="loading-screen" className="loading-screen">
    <div className="loader"></div>
    <div className="developer-name">
      Current Craze: <br />
      Connecting you to the Current World
    </div>
  </div>
);

const NavItem = ({ id, label, onClick, curSelectedNav }) => (
  <li
    className={`hover-link nav-item ${curSelectedNav === id ? 'active' : ''}`}
    id={id}
    onClick={() => onClick(id)}
  >
    {label}
  </li>
);

const NewsCard = ({ article }) => {
  if (!article.urlToImage) return null;

  const date = new Date(article.publishedAt).toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
  });

  const truncateTitle = (title) => {
    const words = title.split(' ');
    if (words.length > 10) {
      return words.slice(0, 8).join(' ') + '...';
    }
    return title;
  };

  return (
    <div className="card" onClick={() => window.open(article.url, '_blank')}>
      <div className="card-header">
        <img src={article.urlToImage} alt="news-image" id="news-img" />
      </div>
      <div className="card-content">
        <h3 id="news-title">{truncateTitle(article.title)}</h3>
        <h6 className="news-source" id="news-source">
          {article.source.name} · {date}
        </h6>
        <p className="news-desc" id="news-desc">
          {article.description}
        </p>
      </div>
    </div>
  );
};

const WeatherWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <a
      className="weatherwidget-io"
      href="https://forecast7.com/en/22d8086d20/jamshedpur/"
      data-label_1="JAMSHEDPUR"
      data-label_2=""
      data-font="Play"
      data-icons="Climacons"
      data-theme="dark"
    >
      JAMSHEDPUR
    </a>
  );
};

const TradingViewWidget = () => {
  useEffect(() => {
    if (!document.querySelector('#tradingview-widget-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.innerHTML = `{
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
          },
          {
            "proName": "FOREXCOM:NSXUSD",
            "title": "US 100"
          },
          {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR to USD"
          },
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "in"
      }`;
      document.getElementsByClassName('tradingview-widget-container__widget')[0].appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://in.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text"></span>
        </a>
      </div>
    </div>
  );
};

export default App;

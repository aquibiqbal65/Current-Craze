const API_KEY = "e762a4a09b3c469ab7211a051b38a688"; // API's = e762a4a09b3c469ab7211a051b38a688 , 98da10c969c54007b24077fd9bd408da
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  bindData(data.articles);
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.opacity = "0";
  loadingScreen.style.pointerEvents = "none"; // Disable interaction with loading screen
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 1600); // Delay the removal of the loading screen to match the transition duration
}

document.addEventListener("DOMContentLoaded", hideLoadingScreen);

let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Function to handle search button click
function handleSearch() {
  const searchText = document.getElementById("search-text").value;
  console.log("Search: ", searchText);
}

document.getElementById("search-text").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default behavior (e.g., form submission)
    document.getElementById("search-button").click(); // Trigger the search button click event
  }
});

document.getElementById("search-button").addEventListener("click", handleSearch);

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

!(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = "https://weatherwidget.io/js/widget.min.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
})(document, "script", "weatherwidget-io-js");

!(function () {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
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
  document.getElementsByClassName("tradingview-widget-container__widget")[0].appendChild(script);
})();
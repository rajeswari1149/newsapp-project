const API_KEY = "YOUR_API_KEY";
const baseUrl = "https://newsapi.org/v2/everything";
const sortBy = "publishedAt";

// Function to fetch news based on query and category
async function fetchNews(query, category = "") {
    try {
        const url = category
            ? `${baseUrl}?q=${query}&category=${category}&apiKey=${API_KEY}&sortBy=${sortBy}`
            : `${baseUrl}?q=${query}&apiKey=${API_KEY}&sortBy=${sortBy}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === "ok") {
            bindData(data.articles);
        } else {
            console.error("Failed to fetch news:", data.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to display news data
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) return;

        const cardClone = document.getElementById("template-news-card").content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data in news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.textContent = article.title;
    newsDesc.textContent = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });
    newsSource.textContent = `${article.source.name} · ${date}`;
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to fetch news articles by category
async function fetchNewsByCategory(category) {
    try {
        const news = await fetchNews(category);
        if (news.length > 0) {
            const cardsContainer = document.getElementById("cards-container");
            const newsTemplate = document.getElementById("template-news-card");
            cardsContainer.innerHTML = "";
            news.forEach(article => {
                if (!article.urlToImage) return;
                const newsClone = newsTemplate.content.cloneNode(true);
                fillDataInNewsCard(newsClone, article);
                cardsContainer.appendChild(newsClone);
            });
        }
    } catch (error) {
        console.error('Error displaying news:', error);
    }
}

// Function to handle search button click
document.getElementById("search-button").addEventListener("click", function() {
    const searchText = document.getElementById("search-text").value.trim();
    if (searchText !== "") {
        fetchNews(searchText);
    }
});

// Function to handle enter key press in search input
document.getElementById("search-text").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const searchText = document.getElementById("search-text").value.trim();
        if (searchText !== "") {
            fetchNews(searchText);
        }
    }
});

// Function to toggle between light and dark themes
function toggleTheme() {
    var body = document.body;
    var themeToggleButton = document.getElementById("theme-toggle-button");
    
    // Toggle dark theme class on body
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
        body.style.backgroundColor = "black"; // Dark background color
        themeToggleButton.style.backgroundColor = "white"; // Light color for toggle button
    } else {
        body.style.backgroundColor = "white"; 
        themeToggleButton.style.backgroundColor = "black";
    }
}

// Function to handle category filter clicks
document.addEventListener("DOMContentLoaded", function() {
    const filterItems = document.querySelectorAll(".filter-item");
    filterItems.forEach(item => {
        item.addEventListener("click", function() {
            const category = this.getAttribute("data-category");
            console.log("Clicked category:", category); // Log category value
            fetchNews("", category);
        });
    });
});
// Fetch news and display notifications on page load
window.addEventListener("load", () => fetchNews("India"));

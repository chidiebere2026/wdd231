// CONFIGURATION VARIABLES
const apiKey = "8e5918aee9189ecf71f2d5a218ec2661"; 
const lat = "6.4483";  // Enugu Latitude
const lon = "7.5139";  // Enugu Longitude

// Members JSON URL 
const membersUrl = "data/members.json"; 

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
    fetchSpotlights();
});

// ==========================================
// WEATHER API SERVICE FETCH (CELSIUS)
// ==========================================
async function fetchWeatherData() {
     const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Weather request pipeline failure");
        const data = await response.json();
        
        renderCurrentWeather(data);
        renderForecast(data);
    } catch (error) {
        console.error("Error loading weather data:", error);
        document.getElementById("current-weather-content").innerHTML = `
            <p>24°C</p><p>Party Cloudy</p><p>High: 29° | Low: 11°</p>
        `;
        document.getElementById("forecast-content").innerHTML = `
            <div class="forecast-day">Today: 32°C</div>
            <div class="forecast-day">Wednesday: 32°C</div>
            <div class="forecast-day">Thursday: 20°C</div>
        `;
    }
}

function renderCurrentWeather(data) {
    const container = document.getElementById("current-weather-content");
    const current = data.list[0]; 
    const iconCode = current.weather[0].icon;
    
    // CHANGED: Labels modified from °F to °C
    container.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${current.weather[0].description}">
        <ul>
            <li><strong>${Math.round(current.main.temp)}°C</strong></li>
            <li>${current.weather[0].description.replace(/\b\w/g, c => c.toUpperCase())}</li>
            <li>High: ${Math.round(data.list.reduce((max, p) => p.main.temp_max > max ? p.main.temp_max : max, -100))}°C</li>
            <li>Low: ${Math.round(data.list.reduce((min, p) => p.main.temp_min < min ? p.main.temp_min : min, 200))}°C</li>
            <li>Humidity: ${current.main.humidity}%</li>
        </ul>
    `;
}

function renderForecast(data) {
    const container = document.getElementById("forecast-content");
    container.innerHTML = ""; 
    
    const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);
    const options = { weekday: 'long' };
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", options);
        
        const div = document.createElement("div");
        div.classList.add("forecast-day");
        // CHANGED: Label modified from °F to °C
        div.innerHTML = `<strong>${dayName}</strong>: ${Math.round(day.main.temp)}°C`;
        container.appendChild(div);
    });
}

// ==========================================
// SYNCHRONIZED SPOTLIGHT MEMBERS MODULE
// ==========================================
async function fetchSpotlights() {
    try {
        const response = await fetch(membersUrl);
        if (!response.ok) throw new Error("Members directory resource down");
        const members = await response.json();
        
        // Filter using numbers (2 = Silver, 3 = Gold) matching directory logic
        const premiumMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        
        // Randomly shuffle the premium matches
        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());
        
        // Select up to 3 cards
        const selectedSpotlights = shuffled.slice(0, Math.min(3, shuffled.length));
        
        renderSpotlights(selectedSpotlights);
    } catch (error) {
        console.error("Error pulling down Spotlight information:", error);
        document.getElementById("spotlight-container").innerHTML = "<p>Failed to parse structural business directory profiles.</p>";
    }
}

function renderSpotlights(selectedMembers) {
    const container = document.getElementById("spotlight-container");
    
    if (!container) return; 
    container.innerHTML = ""; 
    
    if (selectedMembers.length === 0) {
        container.innerHTML = "<p>No premium members available to spotlight.</p>";
        return;
    }
    
    selectedMembers.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("spotlight-card");
        
        const displayUrl = member.website ? member.website.replace(/^https?:\/\/(www\.)?/, '') : "Visit Website";
        
        card.innerHTML = `
            <h4>${member.name}</h4>
            <p class="tagline">${member.tagline || "Innovating Enugu Infrastructure"}</p>
            <hr>
            <div class="spotlight-inner">
                <img src="${member.image || 'images/placeholder-logo.png'}" alt="${member.name} Logo" class="spotlight-logo">
                <div class="spotlight-contact">
                    <p><strong>EMAIL:</strong> ${member.email || 'info@chamberpartner.ng'}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="${member.website || '#'}" target="_blank">${displayUrl}</a></p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// JavaScript for Hamburger
const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector("#navigation"); 
hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
    hamburger.textContent = nav.classList.contains("open") ? "✖" : "☰";
});

// Footer Get Current Year and Last Modified Date
document.getElementById("current-year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;
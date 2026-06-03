// scripts/discover.js
import { itemsOfInterest } from '../data/discover.mjs';

function buildCards() {
    const container = document.querySelector(".discover-grid");
    if (!container) return;

    container.innerHTML = "";

    itemsOfInterest.forEach((item, index) => {

        const card = document.createElement("section");
        card.className = "discover-card";

        // Assign named grid area
        card.style.gridArea = `card${index + 1}`;

        card.innerHTML = `
            <h2>${item.name}</h2>

            <figure>
                <img 
                    src="${item.image}" 
                    alt="Image of ${item.name}" 
                    width="300" 
                    height="200"
                    loading="lazy"
                >
            </figure>

            <address>${item.address}</address>
            <p>${item.description}</p>

            <button>Learn More</button>
        `;

        container.appendChild(card);
    });
}

buildCards();


// Visitor Message
const visitorMessage = document.getElementById("visitor-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
    visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const daysSince = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

    if (daysSince < 1) {
        visitorMessage.textContent = "Back so soon! Awesome!";
    } else {
        visitorMessage.textContent =
        `You last visited ${daysSince} ${daysSince === 1 ? 'day' : 'days'} ago.`;
    }
}

localStorage.setItem("lastVisit", now);

// Hamburger Menu

const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector("#primary-nav");

if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("open");
        
        if (nav.classList.contains("open")) {
            hamburger.textContent = "✖"; 
        } else {
            hamburger.textContent = "☰"; 
        }
    });
}
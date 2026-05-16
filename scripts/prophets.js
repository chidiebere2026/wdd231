const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector('#cards');

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();

  // Temporary testing
  // console.table(data.prophets);

  displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {

    // Create elements
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let birthDate = document.createElement('p');
    let birthPlace = document.createElement('p');
    let portrait = document.createElement('img');

    // Build prophet full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Build birth information
    birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;

    birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;

    // Build image
    portrait.setAttribute('src', prophet.imageurl);

    portrait.setAttribute(
      'alt',
      `Portrait of ${prophet.name} ${prophet.lastname}`
    );

    portrait.setAttribute('loading', 'lazy');

    portrait.setAttribute('width', '340');

    portrait.setAttribute('height', '440');

    // Append elements to card
    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    // Append card to cards div
    cards.appendChild(card);
  });
};

getProphetData();
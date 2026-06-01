const spotlightContainer = document.querySelector('#spotlights');

async function getSpotlights() {
  const response = await fetch('data/members.json');
  const data = await response.json();

  // filter gold (3) and silver (2)
  const filtered = data.filter(m => m.membershipLevel >= 2);

  // shuffle
  const shuffled = filtered.sort(() => 0.5 - Math.random());

  // pick 3
  const selected = shuffled.slice(0, 3);

  selected.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('spotlight-card');

    card.innerHTML = `
      <h3>${member.name}</h3>
      <img src="${member.image}" alt="${member.name}">
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p>Level: ${member.membershipLevel}</p>
    `;

    spotlightContainer.appendChild(card);
  });
}

getSpotlights();
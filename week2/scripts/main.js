async function getMembers() {
  const response = await fetch('members.json');
  const data = await response.json();

  const output = document.getElementById('output');

  data.forEach(family => {
    const section = document.createElement('section');

    section.innerHTML = `
      <h2>${family.familyName} Family</h2>
      <p><strong>Move In Date:</strong> ${family.moveInDate}</p>
      <p><strong>Family Size:</strong> ${family.familySize}</p>
      <p><strong>Visited By Bishopric:</strong> ${family.visitedByBishopric}</p>
    `;

    output.appendChild(section);
  });
}

getMembers();
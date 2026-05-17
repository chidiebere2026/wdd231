const url = "data/members.json";
const cards = document.querySelector("#members");

async function getMembers(){
const response = await fetch(url);
const data = await response.json();
displayMembers(data);
}

getMembers();

function displayMembers(members){

members.forEach(member => {

  let card = document.createElement("div");
card.classList.add("card");

let name = document.createElement("h2");
name.textContent = member.name;

let address = document.createElement("p");
address.textContent = member.address;

let phone = document.createElement("p");
phone.textContent = member.phone;

let link = document.createElement("a");
link.href = member.website;
link.textContent = "Visit Website";

let image = document.createElement("img");
image.src = member.image;
image.alt = member.name;


let membership = document.createElement("p");

let level = "";
if (member.membershipLevel === 1) {
  level = "Member";
} else if (member.membershipLevel === 2) {
  level = "Silver Member";
} else if (member.membershipLevel === 3) {
  level = "Gold Member";
}

membership.textContent = `Membership Level: ${level}`;

card.appendChild(image);
card.appendChild(name);
card.appendChild(address);
card.appendChild(phone);
card.appendChild(membership);
card.appendChild(link);

cards.appendChild(card);

});
}

document.querySelector("#grid").addEventListener("click", ()=>{
cards.classList.add("grid");
cards.classList.remove("list");
});

document.querySelector("#list").addEventListener("click", ()=>{
cards.classList.add("list");
cards.classList.remove("grid");
});


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

// Fetch and display members
getMemberData();
// ==========================
// COURSE DATA
// ==========================
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Introduction to web design and development.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Learn to write and use functions effectively.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Introduction to object-oriented programming.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Create dynamic websites using JavaScript.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Focus on UX, accessibility, and performance.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// ==========================
// WAIT FOR DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("course-container");
    const totalCredits = document.getElementById("totalCredits");

    // ==========================
    // DISPLAY FUNCTION
    // ==========================
    function displayCourses(courseList) {
        container.innerHTML = "";

        courseList.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");

            // Add completed styling
            if (course.completed) {
                card.classList.add("completed");
            }

            // Create elements
            const heading = document.createElement("h3");
            heading.textContent = `${course.subject} ${course.number}: ${course.title}`;

            const creditInfo = document.createElement("p");
            creditInfo.innerHTML = `<strong>Credits:</strong> ${course.credits}`;

            const description = document.createElement("p");
            description.textContent = course.description;

            const technology = document.createElement("p");
            technology.innerHTML = `<strong>Technologies:</strong> ${course.technology.join(", ")}`;

            // Optional Completed Badge
            if (course.completed) {
                const badge = document.createElement("span");
                badge.textContent = "✔ Completed";
                badge.classList.add("badge");
                card.appendChild(badge);
            }

            // Append to card
            card.appendChild(heading);
            card.appendChild(creditInfo);
            card.appendChild(description);
            card.appendChild(technology);

            // Append card to container
            container.appendChild(card);
        });

        // ==========================
        // CALCULATE TOTAL CREDITS
        // ==========================
        const credits = courseList.reduce(
            (sum, course) => sum + course.credits,
            0
        );

        totalCredits.textContent =
            `The total credits for courses listed above is ${credits}`;
    }

 // ==========================
// FILTER BUTTONS
// ==========================

const allBtn = document.getElementById("allBtn");
const wddBtn = document.getElementById("wddBtn");
const cseBtn = document.getElementById("cseBtn");

const buttons = [allBtn, wddBtn, cseBtn];

// Function to set active button
function setActiveButton(activeBtn) {
    buttons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}

allBtn.addEventListener("click", () => {
    displayCourses(courses);
    setActiveButton(allBtn);
});

wddBtn.addEventListener("click", () => {
    displayCourses(courses.filter(course => course.subject === "WDD"));
    setActiveButton(wddBtn);
});

cseBtn.addEventListener("click", () => {
    displayCourses(courses.filter(course => course.subject === "CSE"));
    setActiveButton(cseBtn);
});

// Initial Load
displayCourses(courses);
setActiveButton(allBtn); 
});
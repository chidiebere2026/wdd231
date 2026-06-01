// Thank You Page Logic
        const urlParams = new URLSearchParams(window.location.search);
        const resultsContainer = document.querySelector('#results');
        const fieldLabels = {
            'fname': 'First Name',
            'lname': 'Last Name',
            'email': 'Email Address',
            'phone': 'Mobile Phone',
            'organization': 'Business Name',
            'timestamp': 'Submission Date/Time'
        };

        Object.keys(fieldLabels).forEach(key => {
            if (urlParams.has(key)) {
                let value = urlParams.get(key);
                
                if (key === 'timestamp') {
                    value = new Date(parseInt(value)).toLocaleString();
                }

                const infoDiv = document.createElement('div');
                infoDiv.className = 'info-item';
                infoDiv.innerHTML = `<strong>${fieldLabels[key]}:</strong> ${value}`;
                resultsContainer.appendChild(infoDiv);
            }
        });

        // Footer Get Current Year and Last Modified Date
        document.getElementById("current-year").textContent = new Date().getFullYear();
        document.getElementById("last-modified").textContent = document.lastModified;
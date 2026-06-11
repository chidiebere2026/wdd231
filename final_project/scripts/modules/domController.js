import { fetchOpportunityData } from '../modules/dataService.js';

/**
 * Initializes application components and page-specific functionality.
 */
export async function initializeApplicationEngine() {
    const matrixGrid = document.querySelector('#career-matrix');
    const preferenceForm = document.querySelector('#filter-preference-form');
    const detailModal = document.querySelector('#detail-modal');
    const contactForm = document.querySelector('#contact-hub-form');

    // Career Matrix Page
    if (matrixGrid) {
        try {
            const structuralDataArray = await fetchOpportunityData();

            console.log('Fetched Dataset Array:', structuralDataArray);

            renderMatrixCards(structuralDataArray, matrixGrid);

            if (preferenceForm) {
                // Check if this form contains the filter dropdown elements
                const isFilterForm = document.querySelector('#filter-location') || document.querySelector('#filter-category');
                
                if (isFilterForm) {
                    setupLiveFilteringSystem(preferenceForm, structuralDataArray, matrixGrid);
                } else {
                    // Fallback to profile persistence if it is the subscription form variant
                    loadPersistedFormPreferences();
                    setupFormStorageTracking(preferenceForm);
                }
            }

            setupModalInterfaceTriggers(
                matrixGrid,
                detailModal,
                structuralDataArray
            );
        } catch (error) {
            console.error('Failed to initialize application:', error);

            matrixGrid.innerHTML = `
                <p class="fallback-err">
                    Unable to load opportunity data. Please try again later.
                </p>
            `;
        }
    }

    // Contact Page Form Handler
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            console.log('Contact form validation verified. Transferring to completion page.');
        });
    }

    // Confirmation Page 
    if (document.querySelector('#summary-data-display')) {
        extractAndRenderConfirmationSummary();
    }
}

/**
 * Renders opportunity cards into the matrix container.
 */
function renderMatrixCards(itemsArray, structuralContainer) {
    if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
        structuralContainer.innerHTML = `
            <p class="fallback-err" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                No opportunities match your current filter selections.
            </p>
        `;
        return;
    }

    const elementsTemplate = itemsArray
        .map(
            (item) => `
            <article class="opportunity-card">
                <span class="card-badge">${item.category || 'Technical'}</span>
                
                <h3>${item.title || item.role || 'Untitled Position'}</h3>
                
                <div class="card-meta-loc">
                    📍 ${item.location || 'Remote'}
                </div>
                
                <p>
                    Closing Date: ${item.closingDate || 'N/A'}
                </p>
                
                <button
                    type="button"
                    class="details-btn view-details-btn"
                    data-id="${item.id}"
                >
                    View Details
                </button>
            </article>
        `
        )
        .join('');

    structuralContainer.innerHTML = elementsTemplate;
}

/**
 * Monitors selection modifications and updates the matrix layout live.
 * Handles partial and compound string normalization.
 */
function setupLiveFilteringSystem(formElement, fullDataset, displayContainer) {
    const locationDropdown = document.querySelector('#filter-location');
    const categoryDropdown = document.querySelector('#filter-category');

    if (!locationDropdown || !categoryDropdown) {
        console.warn('Filtering dropdown elements could not be located in the DOM.');
        return;
    }

    const executeFilterPipeline = () => {
        // Grab values, normalize to lowercase, and trim white spaces
        const targetLocation = locationDropdown.value.toLowerCase().trim();
        const targetCategory = categoryDropdown.value.toLowerCase().trim();

        console.log(`Filter active -> Location: "${targetLocation}", Category: "${targetCategory}"`);

        const filteredCollection = fullDataset.filter((opportunity) => {
            const itemLocation = (opportunity.location || '').toLowerCase().trim();
            const itemCategory = (opportunity.category || '').toLowerCase().trim();

            // Flexible substring matching instead of strict equality (===)
            const locationMatch = 
                targetLocation === 'all' || 
                itemLocation.includes(targetLocation);

            const categoryMatch = 
                targetCategory === 'all' || 
                itemCategory.includes(targetCategory);

            return locationMatch && categoryMatch;
        });

        console.log(`Matches isolated: ${filteredCollection.length} out of ${fullDataset.length}`);

        // Repopulate cards safely inside the view layout container
        renderMatrixCards(filteredCollection, displayContainer);
    };

    // Attach native active change listeners
    locationDropdown.addEventListener('change', executeFilterPipeline);
    categoryDropdown.addEventListener('change', executeFilterPipeline);
}

/**
 * Handles modal interactions for viewing opportunity details.
 */
function setupModalInterfaceTriggers(
    gridReference,
    modalWrapper,
    dataArray
) {
    const closeModalButton = document.querySelector('#close-modal-btn');

    if (!gridReference || !modalWrapper || !closeModalButton) {
        return;
    }

    gridReference.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (!targetElement.classList.contains('view-details-btn')) {
            return;
        }

        const targetId = targetElement.dataset.id;

        const focusedItem = dataArray.find(
            (item) => String(item.id) === targetId
        );

        if (!focusedItem) {
            return;
        }

        const modalTitle = document.querySelector('#modal-title');
        const modalCompany = document.querySelector('#modal-company');
        const modalLocation = document.querySelector('#modal-location');
        const modalDate = document.querySelector('#modal-date');
        const modalDescription = document.querySelector('#modal-desc');
        const modalApplyBtn = document.querySelector('#modal-apply-btn');

        if (modalTitle) {
            modalTitle.textContent = focusedItem.title || focusedItem.role || 'Opportunity Details';
        }

        if (modalCompany) {
            modalCompany.textContent = focusedItem.company || 'Organization Context';
        }

        if (modalLocation) {
            modalLocation.textContent = focusedItem.location || 'Remote';
        }

        if (modalDate) {
            modalDate.textContent = focusedItem.closingDate || 'N/A';
        }

        if (modalDescription) {
            modalDescription.textContent = focusedItem.description || 'No description available.';
        }

        if (modalApplyBtn) {
            modalApplyBtn.href = `apply/index.html?jobId=${focusedItem.id}`;
        }

        if (typeof modalWrapper.showModal === 'function') {
            modalWrapper.showModal();
        } else {
            modalWrapper.classList.add('active');
        }
    });

    closeModalButton.addEventListener('click', () => {
        if (typeof modalWrapper.close === 'function') {
            modalWrapper.close();
        } else {
            modalWrapper.classList.remove('active');
        }
    });
}

/**
 * Saves form preferences to localStorage.
 */
function setupFormStorageTracking(formReference) {
    if (!formReference) {
        return;
    }

    formReference.addEventListener('submit', () => {
        const clientPreferencesObj = {
            savedName: document.querySelector('#user-name')?.value || '',
            savedEmail: document.querySelector('#user-email')?.value || '',
            savedLocation: document.querySelector('#preferred-location')?.value || 'All',
            savedFrequency: document.querySelector('#alert-frequency')?.value || 'instantly'
        };

        localStorage.setItem(
            'hubClientPreferences',
            JSON.stringify(clientPreferencesObj)
        );

        console.log('Preferences saved. Redirecting...');
    });
}

/**
 * Loads saved preferences from localStorage.
 */
function loadPersistedFormPreferences() {
    const storedDataString = localStorage.getItem('hubClientPreferences');

    if (!storedDataString) {
        return;
    }

    try {
        const parsedPreferences = JSON.parse(storedDataString);

        const nameEl = document.querySelector('#user-name');
        const emailEl = document.querySelector('#user-email');
        const locationEl = document.querySelector('#preferred-location');
        const frequencyEl = document.querySelector('#alert-frequency');

        if (nameEl) {
            nameEl.value = parsedPreferences.savedName || '';
        }

        if (emailEl) {
            emailEl.value = parsedPreferences.savedEmail || '';
        }

        if (locationEl) {
            locationEl.value = parsedPreferences.savedLocation || 'All';
        }

        if (frequencyEl) {
            frequencyEl.value = parsedPreferences.savedFrequency || 'instantly';
        }
    } catch (error) {
        console.error('Failed to load saved preferences:', error);
        localStorage.removeItem('hubClientPreferences');
    }
}

/**
 * Displays confirmation information from URL parameters dynamically based on form type.
 */
function extractAndRenderConfirmationSummary() {
    const summaryTarget = document.querySelector('#summary-data-display');

    if (!summaryTarget) {
        return;
    }

    const urlParameters = new URLSearchParams(window.location.search);

    const userName = urlParameters.get('userName') || 'User';
    const userEmail = urlParameters.get('userEmail') || 'N/A';

    if (urlParameters.has('contactMessage')) {
        const inquiryType = urlParameters.get('preferredLocation') || 'General Support';
        const clientMessage = urlParameters.get('contactMessage') || '';

        summaryTarget.innerHTML = `
            <p>
                <strong>Sender Name:</strong>
                ${escapeHtml(userName)}
            </p>

            <p>
                <strong>Email Address:</strong>
                ${escapeHtml(userEmail)}
            </p>

            <p>
                <strong>Inquiry Classification:</strong>
                ${escapeHtml(inquiryType)}
            </p>

            <p style="margin-top: 1.5rem; font-weight: bold; color: #1a365d;">
                Submitted Message Context:
            </p>
            <blockquote style="background: #f7fafc; padding: 1rem; border-left: 4px solid #008b8b; margin: 0.5rem 0; font-style: italic; color: #4a5568; border-radius: 0 4px 4px 0;">
                "${escapeHtml(clientMessage)}"
            </blockquote>
        `;
    } else {
        const preferredLocation = urlParameters.get('preferredLocation') || 'All';
        const alertFrequency = urlParameters.get('alertFrequency') || 'instantly';

        summaryTarget.innerHTML = `
            <p>
                <strong>Registrant:</strong>
                ${escapeHtml(userName)}
            </p>

            <p>
                <strong>Destination Delivery:</strong>
                ${escapeHtml(userEmail)}
            </p>

            <p>
                <strong>Configured Region Scope:</strong>
                ${escapeHtml(preferredLocation)}
            </p>

            <p>
                <strong>Alert Sync Cadence:</strong>
                ${escapeHtml(alertFrequency)}
            </p>
        `;
    }
}

/**
 * Basic HTML escaping utility.
 */
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}
import { fetchOpportunityData } from '../modules/dataService.js';

/**
 * Initializes application components and page-specific functionality.
 */
export async function initializeApplicationEngine() {
    const matrixGrid = document.querySelector('#career-matrix');
    const preferenceForm = document.querySelector('#filter-preference-form');
    const detailModal = document.querySelector('#details-modal');

    // Career Matrix Page
    if (matrixGrid) {
        try {
            const structuralDataArray = await fetchOpportunityData();

            console.log('Fetched Dataset Array:', structuralDataArray);

            renderMatrixCards(structuralDataArray, matrixGrid);

            if (preferenceForm) {
                loadPersistedFormPreferences();
                setupFormStorageTracking(preferenceForm);
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
            <p class="fallback-err">
                No opportunities available at this time.
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
 * Handles modal interactions for viewing opportunity details.
 */
function setupModalInterfaceTriggers(
    gridReference,
    modalWrapper,
    dataArray
) {
    const closeModalButton =
        document.querySelector('#close-modal-btn');

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

        const modalTitle =
            document.querySelector('#modal-title');

        const modalDescription =
            document.querySelector('#modal-desc');

        if (modalTitle) {
            modalTitle.textContent =
                focusedItem.title ||
                focusedItem.role ||
                'Opportunity Details';
        }

        if (modalDescription) {
            modalDescription.textContent =
                focusedItem.description ||
                'No description available.';
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

    formReference.addEventListener('submit', (event) => {
        event.preventDefault();

        const clientPreferencesObj = {
            savedName:
                document.querySelector('#user-name')?.value || '',

            savedEmail:
                document.querySelector('#user-email')?.value || '',

            savedLocation:
                document.querySelector('#preferred-location')
                    ?.value || 'All',

            savedFrequency:
                document.querySelector('#alert-frequency')
                    ?.value || 'instantly'
        };

        localStorage.setItem(
            'hubClientPreferences',
            JSON.stringify(clientPreferencesObj)
        );

        console.log('Preferences saved.');
    });
}

/**
 * Loads saved preferences from localStorage.
 */
function loadPersistedFormPreferences() {
    const storedDataString = localStorage.getItem(
        'hubClientPreferences'
    );

    if (!storedDataString) {
        return;
    }

    try {
        const parsedPreferences = JSON.parse(
            storedDataString
        );

        const nameEl =
            document.querySelector('#user-name');

        const emailEl =
            document.querySelector('#user-email');

        const locationEl =
            document.querySelector('#preferred-location');

        const frequencyEl =
            document.querySelector('#alert-frequency');

        if (nameEl) {
            nameEl.value =
                parsedPreferences.savedName || '';
        }

        if (emailEl) {
            emailEl.value =
                parsedPreferences.savedEmail || '';
        }

        if (locationEl) {
            locationEl.value =
                parsedPreferences.savedLocation || 'All';
        }

        if (frequencyEl) {
            frequencyEl.value =
                parsedPreferences.savedFrequency ||
                'instantly';
        }
    } catch (error) {
        console.error(
            'Failed to load saved preferences:',
            error
        );

        localStorage.removeItem(
            'hubClientPreferences'
        );
    }
}

/**
 * Displays confirmation information from URL parameters.
 */
function extractAndRenderConfirmationSummary() {
    const summaryTarget = document.querySelector(
        '#summary-data-display'
    );

    if (!summaryTarget) {
        return;
    }

    const urlParameters = new URLSearchParams(
        window.location.search
    );

    const userName =
        urlParameters.get('userName') || 'User';

    const userEmail =
        urlParameters.get('userEmail') || 'N/A';

    const preferredLocation =
        urlParameters.get('preferredLocation') || 'All';

    const alertFrequency =
        urlParameters.get('alertFrequency') || 'instantly';

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

/**
 * Basic HTML escaping utility.
 */
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}
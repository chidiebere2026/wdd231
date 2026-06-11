import { initializeApplicationEngine } from './modules/domController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Structural Hamburger Menu Interactive Handler
    initializeNavigationToggler();

    // Fire application render workflows
    initializeApplicationEngine();
});

/**
 * Sets up event listeners on structural components to scale and wrap primary menus.
 */
function initializeNavigationToggler() {
    const toggleButton = document.querySelector('.menu-toggle');
    const linksWrapper = document.querySelector('.nav-bar');

    if (toggleButton && linksWrapper) {
        toggleButton.addEventListener('click', () => {
            const isCurrentlyExpanded = linksWrapper.classList.toggle('active');
            toggleButton.setAttribute('aria-expanded', isCurrentlyExpanded.toString());
        });
    }
}
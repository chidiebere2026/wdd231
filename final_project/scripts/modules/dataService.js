/**
 * Asynchronously fetches system array elements from the internal JSON file.
 * Contains try...catch infrastructure for error interception.
 */
export async function fetchOpportunityData() {
    const dataSourceUrl = './data/opportunities.json';
    try {
        const response = await fetch(dataSourceUrl);
        if (!response.ok) {
            throw new Error(`System network response unresolved: ${response.status}`);
        }
        const dataPayload = await response.json();
        return dataPayload;
    } catch (criticalError) {
        console.error('Critical Fetch Interception Failure:', criticalError);
        return [];
    }
}

/**
 * Asynchronously fetches system resource elements from the internal articles JSON file.
 * Contains try...catch infrastructure for structural error interception.
 */
export async function fetchResourceArticles() {
    const dataSourceUrl = './data/articles.json';
    try {
        const response = await fetch(dataSourceUrl);
        if (!response.ok) {
            throw new Error(`Resource layout response unresolved: ${response.status}`);
        }
        const dataPayload = await response.json();
        return dataPayload;
    } catch (criticalError) {
        console.error('Resource Fetch Interception Failure:', criticalError);
        return [];
    }
}
// Base URL for the Backend API. This must match the URL provided by your teammate.
// Base URL: https://web-production-d88ec.up.railway.app
const API_BASE_URL = 'https://web-production-d88ec.up.railway.app/api/v1/tenant';

/**
 * Retrieves the JWT from local storage.
 * NOTE: In a production Next.js app, this should be handled using server-side cookies or React Context for better security/SSR, 
 * but for this MVP, localStorage is sufficient.
 * @returns {string | null} The JWT or null if not found.
 */
const getAuthToken = () => {
    // We assume the token is saved here after successful login/signup
    return localStorage.getItem('jwt_token'); 
};

/**
 * A generic function for making authenticated requests to the Tenant Dashboard API.
 * @param {string} endpoint - The path (e.g., '/configuration'). The full URL will be API_BASE_URL + endpoint.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST'). Defaults to 'GET'.
 * @param {object} [data=null] - The payload body for POST/PUT requests.
 * @returns {Promise<object>} The JSON response data.
 */
export const authFetch = async (endpoint, method = 'GET', data = null) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Authentication Error: No JWT token found.');
        throw new Error('Unauthorized: Please log in again.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
    };

    const config = {
        method: method.toUpperCase(),
        headers: headers,
        // Using body directly here, outside the catch block
        body: (data && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') 
            ? JSON.stringify(data) 
            : undefined,
    };
    
    console.log(`[API] Making ${config.method} request to: ${url}`);
    
    // Use an internal try/catch for the fetch operation itself (network failure)
    let response;
    try {
        response = await fetch(url, config);
    } catch (networkError) {
        // This catches true network failures (like CORS or server is totally offline)
        console.error('Network Request Failed:', networkError);
        throw new Error(`Network Error: Cannot connect to API server.`);
    }

    // Handle HTTP status errors (404, 401, 500)
    if (!response.ok) {
        let errorDetail = response.statusText;
        let errorBody = null;

        // Attempt to read the JSON body for error details
        try {
            errorBody = await response.json();
            // Use backend's detail message if available (FastAPI standard)
            errorDetail = errorBody.detail || errorBody.error || JSON.stringify(errorBody);
        } catch (e) {
            // If response is not JSON (e.g., 404 HTML page), use statusText
        }
        
        // Log and throw the structured error string
        const errorMessage = `API Error: ${response.status} - ${errorDetail}`;
        console.error(errorMessage, errorBody);
        
        throw new Error(errorMessage);
    }

    // Return the JSON body for successful requests
    // We return response.data if the caller needs the whole axios response
    // But since we used fetch, we just return the parsed JSON data here.
    return response.json();
};
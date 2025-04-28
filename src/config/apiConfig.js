const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api" // For local development
    : "https://your-production-api.com/api"; // For production

// Define your API URLs
const apiConfig = {
  BASE_URL: API_BASE_URL,
  LOGIN_URL: `${API_BASE_URL}/login`, // Correctly combine the base URL with the endpoint
  LOGOUT_URL: `${API_BASE_URL}/logout`,
  USERS_COUNTS: `${API_BASE_URL}/admin/users/status/counts`,
  USERS_LIST: `${API_BASE_URL}/admin/users`,
  ADD_USER: `${API_BASE_URL}/admin/add/user`,
};

export default apiConfig; // Export the apiConfig object

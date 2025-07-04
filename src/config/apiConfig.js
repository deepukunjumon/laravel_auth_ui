const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://192.168.1.34:8000/api" // For local development
    : "https://your-production-api.com/api"; // For production

// Define API URLs
const apiConfig = {
  BASE_URL: API_BASE_URL,

  LOGIN_URL: `${API_BASE_URL}/login`,
  LOGOUT_URL: `${API_BASE_URL}/logout`,

  USERS_COUNTS: `${API_BASE_URL}/admin/users/status/counts`,
  USERS_LIST: `${API_BASE_URL}/admin/users`,
  ADD_USER: `${API_BASE_URL}/admin/add/user`,
  DELETE_USER: (id) => `${API_BASE_URL}/admin/delete/user/${id}`,

  GET_USER_DETAILS: (id) => `${API_BASE_URL}/admin/get/user/${id}`,
  UPDATE_USER_DETAILS: (id) => `${API_BASE_URL}/admin/update/user/${id}`,
};

export default apiConfig;

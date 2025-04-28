import axios from "axios";
import apiConfig from "../config/apiConfig";

export const login = async (email, password) => {
  return axios.post(`${apiConfig.BASE_URL}/login`, { email, password });
};

export const register = async (data) => {
  return axios.post(`${apiConfig.BASE_URL}/register`, data);
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      apiConfig.LOGOUT_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    // ignore error, just remove token
  }
  localStorage.removeItem("token");
};

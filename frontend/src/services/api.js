
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach JWT token to protected API requests
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Backend health check
export const checkBackend = async () => {
  const response = await API.get("/");
  return response.data;
};

// Admin login
export const loginAdmin = async (email, password) => {
  const response = await API.post("/login", {
    email,
    password,
  });

  sessionStorage.setItem(
    "admin_token",
    response.data.access_token
  );

  sessionStorage.setItem(
    "admin_profile",
    JSON.stringify(response.data.admin)
  );

  return response.data;
};

// Admin logout
export const logoutAdmin = () => {
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_profile");
};

// Student prediction
export const predictStudent = async (studentData) => {
  const response = await API.post("/predict", {
    student_data: studentData,
  });

  return response.data;
};

// Student counselling
export const getCounselling = async (studentData) => {
  const response = await API.post("/counsel", {
    student_data: studentData,
  });

  return response.data;
};

// AI chatbot
export const sendChatMessage = async (message) => {
  const response = await API.post("/chat", {
    message,
  });

  return response.data;
};

export default API;

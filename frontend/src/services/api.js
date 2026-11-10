
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

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

export const checkBackend = async () =>
  (await API.get("/")).data;

export const loginAdmin = async (email, password) => {
  const response = await API.post("/login", { email, password });

  sessionStorage.setItem("admin_token", response.data.access_token);
  sessionStorage.setItem(
    "admin_profile",
    JSON.stringify(response.data.admin)
  );

  return response.data;
};

export const logoutAdmin = () => {
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_profile");
};

export const predictStudent = async (studentData) =>
  (await API.post("/predict", { student_data: studentData })).data;

export const getCounselling = async (studentData) =>
  (await API.post("/counsel", { student_data: studentData })).data;

export const sendChatMessage = async (message) =>
  (await API.post("/chat", { message })).data;

export default API;

import axios from "axios";

// Determine base URL based on environment
const API_BASE_URL = "http://127.0.0.1:8000"; // Update to your production URL if deployed live

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to attach correct token
API.interceptors.request.use(
  (config) => {
    let token = null;
    
    // Check if the request is for student endpoints
    if (config.url && config.url.includes("/student")) {
      token = sessionStorage.getItem("student_token");
    } else {
      token = sessionStorage.getItem("admin_token") || sessionStorage.getItem("student_token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------
// AUTH & ADMIN SERVICES
// ------------------------------------------

export const loginAdmin = async (email, password) => {
  const response = await API.post("/login", { email, password });
  if (response.data.access_token) {
    sessionStorage.setItem("admin_token", response.data.access_token);
    sessionStorage.setItem("admin_profile", JSON.stringify(response.data.admin));
  }
  return response.data;
};

export const logoutAdmin = () => {
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_profile");
};

// ------------------------------------------
// STUDENT SERVICES
// ------------------------------------------

export const registerStudentAccount = async (studentData) => {
  const response = await API.post("/student/register", studentData);
  return response.data;
};

export const loginStudent = async (email, password) => {
  const response = await API.post("/student/login", { email, password });
  if (response.data.access_token) {
    sessionStorage.setItem("student_token", response.data.access_token);
    sessionStorage.setItem("student_profile", JSON.stringify(response.data.student));
  }
  return response.data;
};

export const logoutStudent = () => {
  sessionStorage.removeItem("student_token");
  sessionStorage.removeItem("student_profile");
};

export const getStudentProfile = async () => {
  const response = await API.get("/student/me");
  return response.data;
};

export const getMyAssessments = async () => {
  const response = await API.get("/student/my-assessments");
  return response.data;
};

// ------------------------------------------
// DASHBOARD & PREDICTION SERVICES
// ------------------------------------------

export const getDashboardStats = async () => (await API.get("/dashboard-stats")).data;

export const predictStudent = async (studentData) =>
  (await API.post("/predict", { student_data: studentData })).data;

export const getCounselling = async (studentData) =>
  (await API.post("/counsel", { student_data: studentData })).data;

export const sendChatMessage = async (message) =>
  (await API.post("/chat", { message })).data;

export const getExplainSamples = async () => {
  // Mock or fetch explain samples if needed
  return { samples: [] };
};

export const getShapExplanation = async (studentData) => {
  return (await API.post("/explain", { student_data: studentData })).data;
};

export default API;
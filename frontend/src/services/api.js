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
    let token = null;
    if (config.url && config.url.includes("/student")) {
      token = sessionStorage.getItem("student_token");
    } else {
      token = sessionStorage.getItem("admin_token") || sessionStorage.getItem("student_token");
    }

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const checkBackend = async () =>
  (await API.get("/")).data;

// ==========================================
// ADMIN APIs
// ==========================================

export const loginAdmin = async (email, password) => {
  const response = await API.post("/login", { email, password });

  sessionStorage.removeItem("student_token");
  sessionStorage.removeItem("student_profile");

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

export const getExplainSamples = async () =>
  (await API.get("/explain/samples")).data;

export const getShapExplanation = async (studentData) =>
  (await API.post("/explain", { student_data: studentData })).data;

export const sendChatMessage = async (message) =>
  (await API.post("/chat", { message })).data;

// Admin: Student Management & Approvals
export const getPendingStudents = async () =>
  (await API.get("/admin/pending-students")).data;

export const updateStudentApproval = async (studentId, status) =>
  (await API.patch(`/admin/students/${studentId}/approval`, { status })).data;

export const getAllStudents = async () =>
  (await API.get("/students")).data;

export const searchStudents = async (query) =>
  (await API.get("/students/search", { params: { q: query } })).data;

export const createStudentRecord = async (studentData) =>
  (await API.post("/students", studentData)).data;

// ==========================================
// STUDENT APIs
// ==========================================

export const registerStudentAccount = async (studentData) => {
  const response = await API.post("/student/register", studentData);
  return response.data;
};

export const loginStudent = async (email, password) => {
  const response = await API.post("/student/login", { email, password });

  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_profile");

  sessionStorage.setItem("student_token", response.data.access_token);
  sessionStorage.setItem(
    "student_profile",
    JSON.stringify(response.data.student)
  );

  return response.data;
};

export const getStudentProfile = async () => {
  const token = sessionStorage.getItem("student_token");
  const response = await API.get("/student/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logoutStudent = () => {
  sessionStorage.removeItem("student_token");
  sessionStorage.removeItem("student_profile");
};

export default API;
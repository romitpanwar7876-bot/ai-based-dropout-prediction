import { useState, useCallback } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import LoginSelection from "./pages/LoginSelection";
import Login from "./pages/Login";
import StudentAuth from "./pages/StudentAuth";
import StudentDashboard from "./pages/StudentDashboard";

import Dashboard from "./pages/Dashboard";
import ManageStudents from "./pages/ManageStudents";
import StudentPrediction from "./pages/StudentPrediction";
import Counselling from "./pages/Counselling";
import Explainability from "./pages/Explainability";
import Chatbot from "./pages/Chatbot";

import { logoutAdmin, logoutStudent } from "./services/api";

function App() {
  const [admin, setAdmin] = useState(() => {
    const token = sessionStorage.getItem("admin_token");
    const savedAdmin = sessionStorage.getItem("admin_profile");

    if (token && savedAdmin) {
      try {
        return JSON.parse(savedAdmin);
      } catch {
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_profile");
      }
    }
    return null;
  });

  const [student, setStudent] = useState(() => {
    const token = sessionStorage.getItem("student_token");
    const savedStudent = sessionStorage.getItem("student_profile");

    if (token && savedStudent) {
      try {
        return JSON.parse(savedStudent);
      } catch {
        sessionStorage.removeItem("student_token");
        sessionStorage.removeItem("student_profile");
      }
    }
    return null;
  });

  const [selectedPortal, setSelectedPortal] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdmin(null);
    setSelectedPortal(null);
    setActivePage("Dashboard");
  };

  const handleStudentLogin = (studentData) => {
    setStudent(studentData);
  };

  const handleStudentLogout = useCallback(() => {
    logoutStudent();
    setStudent(null);
    setSelectedPortal(null);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "Manage Students":
        return <ManageStudents />;
      case "Student Prediction":
        return <StudentPrediction />;
      case "Counselling":
        return <Counselling />;
      case "Explainability":
        return <Explainability />;
      case "AI Chatbot":
        return <Chatbot />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  // Logged-in Student View
  if (student) {
    return (
      <StudentDashboard
        student={student}
        onLogout={handleStudentLogout}
      />
    );
  }

  // Unauthenticated Portal Selection / Login Views
  if (!admin) {
    if (!selectedPortal) {
      return <LoginSelection onSelect={setSelectedPortal} />;
    }

    if (selectedPortal === "admin") {
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => setSelectedPortal(null)}
        />
      );
    }

    return (
      <StudentAuth
        onLogin={handleStudentLogin}
        onBack={() => setSelectedPortal(null)}
      />
    );
  }

  // Logged-in Admin View
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <div className="flex-1 min-w-0">
        <Navbar
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
          admin={admin}
          onLogout={handleLogout}
        />
        <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
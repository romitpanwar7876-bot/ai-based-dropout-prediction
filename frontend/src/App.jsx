
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentPrediction from "./pages/StudentPrediction";
import Counselling from "./pages/Counselling";
import Explainability from "./pages/Explainability";
import Chatbot from "./pages/Chatbot";

import { logoutAdmin } from "./services/api";

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

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdmin(null);
    setActivePage("Dashboard");
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard onNavigate={setActivePage} />;

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

  // Show login page when admin is not authenticated
  if (!admin) {
    return <Login onLogin={handleLogin} />;
  }

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

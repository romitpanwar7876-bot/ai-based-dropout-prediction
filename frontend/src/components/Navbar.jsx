
import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Loader2,
  ChevronDown,
  LogOut,
} from "lucide-react";
import API from "../services/api";

function Navbar({ activePage, onMenuClick, admin, onLogout }) {
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2) {
      setStudents([]);
      setError("");
      setLoading(false);
      return;
    }

    let isActive = true;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/students/search", {
          params: { q: query },
        });

        if (isActive) {
          setStudents(response.data.students || []);
        }
      } catch (err) {
        if (isActive) {
          setStudents([]);
          setError(
            err.response?.status === 401
              ? "Session expired. Please login again."
              : "Unable to search students. Check backend connection."
          );
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }, 400);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [searchText]);

  const adminName = admin?.name || "Admin";
  const adminEmail = admin?.email || "";

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            {activePage}
          </h2>
          <p className="text-xs text-slate-500">
            AI-Based Student Support Platform
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Student Search */}
        <div className="relative hidden md:block">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2">
            {loading ? (
              <Loader2 size={17} className="text-slate-400 animate-spin" />
            ) : (
              <Search size={17} className="text-slate-400" />
            )}

            <input
              type="text"
              placeholder="Search name or roll no..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 w-48"
            />
          </div>

          {searchText.trim().length >= 2 && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              {loading && (
                <p className="p-4 text-sm text-slate-500">
                  Searching students...
                </p>
              )}

              {!loading && error && (
                <p className="p-4 text-sm text-red-500">{error}</p>
              )}

              {!loading && !error && students.length === 0 && (
                <p className="p-4 text-sm text-slate-500">
                  No students found.
                </p>
              )}

              {!loading && students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 border-b border-slate-100 last:border-0 hover:bg-blue-50"
                >
                  <p className="font-semibold text-sm text-slate-800">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Roll No: {student.roll_number}
                  </p>
                  <p className="text-xs text-slate-500">
                    {student.course || "Course not specified"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Admin profile"
            aria-expanded={profileOpen}
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <p className="font-semibold text-sm text-slate-800">
                  {adminName}
                </p>
                <p className="text-xs text-slate-500 mt-1 break-all">
                  {adminEmail}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Administrator
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;

import { useEffect, useState } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Hash,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { getStudentProfile } from "../services/api";
import Chatbot from "./Chatbot";

function StudentDashboard({ student, onLogout }) {
  const [profile, setProfile] = useState(student || null);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "chatbot"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getStudentProfile();
        if (isMounted) {
          setProfile(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            onLogout();
          } else {
            setError("Could not refresh student profile from server.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [onLogout]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                Student Support Portal
              </h1>
              <p className="text-xs text-slate-500">
                Welcome, {profile?.name || "Student"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User size={16} />
              My Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chatbot")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "chatbot"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <MessageSquare size={16} />
              AI Counsellor
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "profile" ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Academic Profile
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Verified student account details
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 uppercase">
                  <CheckCircle2 size={14} />
                  {profile?.account_status || "active"}
                </span>
              </div>

              {loading && !profile ? (
                <p className="text-sm text-slate-500 py-8">
                  Loading student profile...
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
                    <User size={20} className="text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Full Name
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        {profile?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
                    <Hash size={20} className="text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Roll Number
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        {profile?.roll_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
                    <BookOpen size={20} className="text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Course / Department
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        {profile?.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50">
                    <Mail size={20} className="text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Registered Email
                      </p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Card */}
            <div className="bg-emerald-600 rounded-2xl p-6 md:p-8 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  Need Academic or Personal Counselling?
                </h3>
                <p className="text-sm text-emerald-100 mt-1">
                  Talk to our AI Student Counselling Assistant for study plans,
                  exam guidance, and academic support.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("chatbot")}
                className="px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition"
              >
                Open AI Counsellor
              </button>
            </div>
          </div>
        ) : (
          <Chatbot />
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
import { useState } from "react";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Hash,
  BookOpen,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { loginStudent, registerStudentAccount } from "../services/api";

function StudentAuth({ onLogin, onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Registration states
  const [regName, setRegName] = useState("");
  const [regRollNumber, setRegRollNumber] = useState("");
  const [regCourse, setRegCourse] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginStudent(email.trim(), password);
      onLogin(response.student);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Student login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (
      !regName.trim() ||
      !regRollNumber.trim() ||
      !regCourse.trim() ||
      !regEmail.trim() ||
      !regPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerStudentAccount({
        name: regName.trim(),
        roll_number: regRollNumber.trim(),
        course: regCourse.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      setSuccessMsg(
        response.message ||
          "Registration submitted! Please wait for admin approval before logging in."
      );
      setRegName("");
      setRegRollNumber("");
      setRegCourse("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to portal selection
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 p-4 rounded-2xl">
            <GraduationCap size={36} className="text-emerald-600" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Student Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-Based Student Support & Counselling System
          </p>
        </div>

        {/* Toggle Login / Register */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`py-2 text-sm font-semibold rounded-lg transition ${
              mode === "login"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`py-2 text-sm font-semibold rounded-lg transition ${
              mode === "register"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            New Registration
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-start gap-2">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-2.5 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Roll Number
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <Hash size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. CS2026001"
                  value={regRollNumber}
                  onChange={(e) => setRegRollNumber(e.target.value)}
                  className="w-full p-2.5 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course / Branch
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <BookOpen size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={regCourse}
                  onChange={(e) => setRegCourse(e.target.value)}
                  className="w-full p-2.5 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password (min 8 characters)
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg px-3">
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Submitting..." : "Register Account"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          New registrations require admin approval before login
        </p>
      </div>
    </div>
  );
}

export default StudentAuth;
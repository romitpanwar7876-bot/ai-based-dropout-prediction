
import { GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

function LoginSelection({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">

      <div className="w-full max-w-4xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl mb-4">
            <GraduationCap size={34} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            AI-Based Student Support System
          </h1>

          <p className="text-slate-500 mt-3">
            Welcome! Select your portal to continue.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Student Portal */}
          <button
            type="button"
            onClick={() => onSelect("student")}
            className="text-left bg-white border border-slate-200 rounded-2xl p-8 hover:border-emerald-500 hover:shadow-lg transition"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-xl mb-6">
              <GraduationCap size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Student Portal
            </h2>

            <p className="text-sm text-slate-500 mt-3">
              Access your academic profile, dropout risk assessment,
              counselling recommendations and AI support.
            </p>

            <div className="flex items-center gap-2 text-emerald-700 font-semibold mt-8">
              Student Login <ArrowRight size={18} />
            </div>
          </button>

          {/* Admin Portal */}
          <button
            type="button"
            onClick={() => onSelect("admin")}
            className="text-left bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg transition"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-700 rounded-xl mb-6">
              <ShieldCheck size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Admin Portal
            </h2>

            <p className="text-sm text-slate-500 mt-3">
              Manage student records, monitor dropout risks,
              view analytics and manage counselling activities.
            </p>

            <div className="flex items-center gap-2 text-blue-700 font-semibold mt-8">
              Admin Login <ArrowRight size={18} />
            </div>
          </button>

        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          AI-Based Dropout Prediction and Counselling System
        </p>

      </div>
    </div>
  );
}

export default LoginSelection;

import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import {
  Users,
  UserX,
  GraduationCap,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Brain,
} from "lucide-react";

import StatCard from "../components/StatCard";

function Dashboard({ onNavigate }) {
    const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError("Unable to load dashboard statistics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);
  return (
    <div className="space-y-8">
        {loading && (
  <p className="text-sm text-blue-600">
    Loading dashboard statistics...
  </p>
)}

{error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}


      {/* Welcome Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800">
          Welcome to Dropout AI
        </h2>

        <p className="text-slate-500 mt-2">
          Monitor student outcomes and identify students who may need additional support.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Students"
          value="4,424"
          subtitle="Students in UCI dataset"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Dropout Cases"
          value="1,421"
          subtitle="Historical dataset records"
          icon={UserX}
          color="red"
        />

        <StatCard
          title="Graduated Students"
          value="2,209"
          subtitle="Historical dataset records"
          icon={GraduationCap}
          color="green"
        />

        <StatCard
          title="XGBoost Accuracy"
          value="73.11%"
          subtitle="Held-out test set accuracy"
          icon={Activity}
          color="purple"
        />

      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Prediction Card */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Brain size={25} />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-800">
                AI Student Prediction
              </h3>

              <p className="text-sm text-slate-500">
                Early-warning student outcome analysis
              </p>
            </div>
          </div>

          <p className="text-slate-600 leading-7">
            Enter a student's admission and first-semester academic
            information to estimate their likely educational outcome.
            The system can also generate counselling recommendations
            based on identified academic and financial indicators.
          </p>

          <button
            onClick={() => onNavigate("Student Prediction")}
            className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
          >
            Start Prediction
            <ArrowRight size={18} />
          </button>

        </div>

        {/* System Status */}
        <div className="bg-slate-900 text-white rounded-2xl p-7 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={25} className="text-green-400" />

            <h3 className="font-bold text-lg">
              Project Overview
            </h3>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-slate-400 text-sm">
                Prediction Model
              </p>
              <p className="font-semibold mt-1">
                XGBoost Classifier
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Prediction Classes
              </p>
              <p className="font-semibold mt-1">
                Dropout / Enrolled / Graduate
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Input Features
              </p>
              <p className="font-semibold mt-1">
                30 Admission & First-Semester Features
              </p>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">
                  Early-warning analysis
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* Navigation Cards */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-5">
          System Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          {[
            {
              title: "Student Prediction",
              description: "Estimate student educational outcomes.",
              icon: GraduationCap,
            },
            {
              title: "Counselling",
              description: "View academic and financial support suggestions.",
              icon: Users,
            },
            {
              title: "Explainability",
              description: "Understand factors influencing predictions.",
              icon: Brain,
            },
            {
              title: "AI Chatbot",
              description: "Explore the student counselling assistant.",
              icon: Activity,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => onNavigate(item.title)}
                className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <Icon size={25} className="text-blue-600 mb-4" />

                <h4 className="font-bold text-slate-800">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  {item.description}
                </p>
              </button>
            );
          })}

        </div>
      </section>

      <p className="text-xs text-slate-400">
        Dashboard statistics represent the historical UCI dataset and offline model evaluation, not live student records.
      </p>

    </div>
  );
}

export default Dashboard;

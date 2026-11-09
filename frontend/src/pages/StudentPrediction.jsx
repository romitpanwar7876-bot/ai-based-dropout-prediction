
import { useState } from "react";
import {
  UserRound,
  GraduationCap,
  BookOpen,
  Wallet,
  RotateCcw,
  Search,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { predictStudent, getCounselling } from "../services/api";
import ProbabilityChart from "../components/ProbabilityChart";

const initialValues = {
  "Marital Status": 1,
  "Application mode": 17,
  "Application order": 5,
  "Course": 171,
  "Daytime/evening attendance": 1,
  "Previous qualification": 1,
  "Previous qualification (grade)": 122,
  "Nacionality": 1,
  "Mother's qualification": 19,
  "Father's qualification": 12,
  "Mother's occupation": 5,
  "Father's occupation": 9,
  "Admission grade": 127.3,
  "Displaced": 1,
  "Educational special needs": 0,
  "Debtor": 0,
  "Tuition fees up to date": 1,
  "Gender": 1,
  "Scholarship holder": 0,
  "Age at enrollment": 20,
  "International": 0,
  "Curricular units 1st sem (credited)": 0,
  "Curricular units 1st sem (enrolled)": 0,
  "Curricular units 1st sem (evaluations)": 0,
  "Curricular units 1st sem (approved)": 0,
  "Curricular units 1st sem (grade)": 0,
  "Curricular units 1st sem (without evaluations)": 0,
  "Unemployment rate": 10.8,
  "Inflation rate": 1.4,
  "GDP": 1.74,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-2 block text-sm font-medium text-slate-700";

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function StudentPrediction() {
  const [profile, setProfile] = useState({
    name: "",
    rollNumber: "",
    course: "",
  });

  const [formData, setFormData] = useState(initialValues);

  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateProfile = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateModelField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const resetForm = () => {
    setProfile({
      name: "",
      rollNumber: "",
      course: "",
    });

    setFormData(initialValues);
    setPrediction(null);
    setRecommendations([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.rollNumber.trim()) {
      setError("Please enter the student's name and roll number.");
      return;
    }

    const missingField = Object.entries(formData).find(
      ([, value]) => value === "" || !Number.isFinite(value)
    );

    if (missingField) {
      setError(`Please enter a valid value for ${missingField[0]}.`);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPrediction(null);
      setRecommendations([]);

      const [predictionResult, counsellingResult] = await Promise.all([
        predictStudent(formData),
        getCounselling(formData),
      ]);

      setPrediction(predictionResult);

      setRecommendations(
        counsellingResult.counselling_recommendations || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to connect to the prediction server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">

      {/* Page heading */}
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <GraduationCap size={17} />
          Student Support Platform
        </div>

        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Student Risk Assessment
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter student details and academic information to generate
          a preliminary dropout prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Student information */}
        <Section
          icon={UserRound}
          title="Student Information"
          description="Basic student identification details"
        >
          <Field label="Student Name">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile("name", e.target.value)}
              placeholder="Enter full name"
              className={inputClass}
            />
          </Field>

          <Field label="Roll Number / Student ID">
            <input
              type="text"
              value={profile.rollNumber}
              onChange={(e) =>
                updateProfile("rollNumber", e.target.value)
              }
              placeholder="Enter student ID"
              className={inputClass}
            />
          </Field>

          <Field label="Course / Programme">
            <input
              type="text"
              value={profile.course}
              onChange={(e) => updateProfile("course", e.target.value)}
              placeholder="Example: B.Tech Computer Science"
              className={inputClass}
            />
          </Field>

          <Field label="Age at Enrollment">
            <input
              type="number"
              min="15"
              max="100"
              value={formData["Age at enrollment"]}
              onChange={(e) =>
                updateModelField("Age at enrollment", e.target.value)
              }
              className={inputClass}
            />
          </Field>
        </Section>

        {/* Academic information */}
        <Section
          icon={BookOpen}
          title="Academic Performance"
          description="Admission and first-semester academic records"
        >
          <Field label="Admission Grade">
            <input
              type="number"
              step="any"
              value={formData["Admission grade"]}
              onChange={(e) =>
                updateModelField("Admission grade", e.target.value)
              }
              className={inputClass}
            />
          </Field>

          <Field label="Previous Qualification Grade">
            <input
              type="number"
              step="any"
              value={formData["Previous qualification (grade)"]}
              onChange={(e) =>
                updateModelField(
                  "Previous qualification (grade)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Subjects / Units Enrolled">
            <input
              type="number"
              min="0"
              value={formData["Curricular units 1st sem (enrolled)"]}
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (enrolled)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Subjects / Units Evaluated">
            <input
              type="number"
              min="0"
              value={formData["Curricular units 1st sem (evaluations)"]}
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (evaluations)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Subjects / Units Passed">
            <input
              type="number"
              min="0"
              value={formData["Curricular units 1st sem (approved)"]}
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (approved)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="First Semester Grade">
            <input
              type="number"
              step="any"
              value={formData["Curricular units 1st sem (grade)"]}
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (grade)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Subjects Without Evaluation">
            <input
              type="number"
              min="0"
              value={
                formData["Curricular units 1st sem (without evaluations)"]
              }
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (without evaluations)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Credited Units">
            <input
              type="number"
              min="0"
              value={formData["Curricular units 1st sem (credited)"]}
              onChange={(e) =>
                updateModelField(
                  "Curricular units 1st sem (credited)",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>
        </Section>

        {/* Financial information */}
        <Section
          icon={Wallet}
          title="Financial Information"
          description="Fee payment and financial support details"
        >
          <Field label="Are tuition fees up to date?">
            <select
              value={formData["Tuition fees up to date"]}
              onChange={(e) =>
                updateModelField("Tuition fees up to date", e.target.value)
              }
              className={inputClass}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </Field>

          <Field label="Does the student have outstanding fees?">
            <select
              value={formData["Debtor"]}
              onChange={(e) => updateModelField("Debtor", e.target.value)}
              className={inputClass}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </Field>

          <Field label="Is the student receiving a scholarship?">
            <select
              value={formData["Scholarship holder"]}
              onChange={(e) =>
                updateModelField("Scholarship holder", e.target.value)
              }
              className={inputClass}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </Field>
        </Section>

        {/* Model limitations */}
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle
            size={21}
            className="mt-0.5 shrink-0 text-amber-600"
          />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Important: Model input limitation
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              The existing model requires 30 features from its original
              dataset. Some fields not shown in this form are currently
              supplied using sample defaults. This is a prototype assessment,
              not a fully verified prediction from the student's complete
              records. Do not use it alone to make decisions about students.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RotateCcw size={17} />
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <LoaderCircle size={19} className="animate-spin" />
            ) : (
              <Search size={19} />
            )}
            {loading ? "Analyzing..." : "Predict Dropout Risk"}
          </button>
        </div>
      </form>

      {/* Prediction results */}
      {prediction && (
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Assessment Results
              </h3>
              <p className="text-sm text-slate-500">
                Student: {profile.name} ({profile.rollNumber})
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-sm text-blue-700">
              Predicted Student Outcome
            </p>
            <h2 className="mt-1 text-2xl font-bold text-blue-900">
              {prediction.predicted_outcome}
            </h2>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-800">
              Outcome Probabilities
            </h4>
            <ProbabilityChart
              probabilities={prediction.class_probabilities}
            />
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-800">
              Counselling Recommendations
            </h4>

            {recommendations.length === 0 ? (
              <p className="text-sm text-slate-500">
                No predefined recommendations were generated.
              </p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <h5 className="font-semibold text-slate-800">
                        {item.category}
                      </h5>
                      <span className="text-sm font-semibold text-blue-600">
                        {item.priority} Priority
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.issue}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {item.action}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Predictions are estimates. A qualified college counsellor
            should review the student's circumstances before taking action.
          </p>
        </section>
      )}
    </div>
  );
}

export default StudentPrediction;

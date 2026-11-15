import { useEffect, useState, useCallback } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Info,
  BarChart3,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { getExplainSamples, getShapExplanation } from "../services/api";

function Explainability() {
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState("");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState("");

  const runExplanation = useCallback(async (studentData) => {
    try {
      setExplaining(true);
      setError("");
      const result = await getShapExplanation(studentData);
      setExplanation(result);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to generate SHAP explanation."
      );
    } finally {
      setExplaining(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSamples = async () => {
      try {
        setLoading(true);
        const res = await getExplainSamples();
        const list = res.samples || [];

        if (isMounted) {
          setSamples(list);
          if (list.length > 0) {
            setSelectedSampleId(String(list[0].id));
            await runExplanation(list[0].student_data);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail ||
              "Unable to load student records for SHAP analysis."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSamples();

    return () => {
      isMounted = false;
    };
  }, [runExplanation]);

  const handleSampleChange = async (e) => {
    const newId = e.target.value;
    setSelectedSampleId(newId);

    const found = samples.find((s) => String(s.id) === newId);
    if (found) {
      await runExplanation(found.student_data);
    }
  };

  const factors = explanation?.top_factors || [];
  const maxImpact =
    factors.length > 0
      ? Math.max(...factors.map((f) => Math.abs(f.impact)), 0.0001)
      : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Model Explainability (SHAP)
          </h2>
          <p className="text-slate-500 mt-1">
            Live feature-level explanation of why the XGBoost model predicts Dropout risk.
          </p>
        </div>

        {/* Sample Student Selector */}
        {samples.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={selectedSampleId}
              onChange={handleSampleChange}
              disabled={explaining}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-purple-500"
            >
              {samples.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.label}
                </option>
              ))}
            </select>

            {explaining && (
              <RefreshCw size={18} className="text-purple-600 animate-spin" />
            )}
          </div>
        )}
      </div>

      {/* Information Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4">
        <Brain size={28} className="text-purple-600 shrink-0" />
        <div>
          <h3 className="font-bold text-purple-900">
            SHAP-based Explainable AI
          </h3>
          <p className="text-sm text-purple-800 mt-1 leading-6">
            SHAP (SHapley Additive exPlanations) calculates how each individual
            feature pushes the XGBoost prediction toward or away from Dropout.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Model & Prediction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Predicted Outcome</p>
          <h3
            className={`text-xl font-bold mt-2 ${
              explanation?.predicted_outcome === "Dropout"
                ? "text-red-600"
                : explanation?.predicted_outcome === "Graduate"
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {loading ? "Loading..." : explanation?.predicted_outcome || "-"}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Dropout Probability</p>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            {loading
              ? "Loading..."
              : explanation?.class_probabilities?.Dropout !== undefined
              ? `${explanation.class_probabilities.Dropout}%`
              : "-"}
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Encoded Model Features</p>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            {explanation?.total_encoded_features || 231} Features
          </h3>
        </div>
      </div>

      {/* Feature Impact */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={23} className="text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Top 10 Feature Contributions (Live SHAP Values)
          </h3>
        </div>

        <p className="text-sm text-slate-500 mb-8">
          Real-time TreeExplainer feature impacts for the selected student record.
        </p>

        {loading || explaining ? (
          <p className="text-sm text-purple-600 py-6">
            Calculating real-time SHAP values...
          </p>
        ) : factors.length === 0 ? (
          <p className="text-sm text-slate-500 py-6">
            No SHAP explanation data available.
          </p>
        ) : (
          <div className="space-y-6">
            {factors.map((feature, idx) => {
              const positive = feature.direction === "positive";
              const width = (Math.abs(feature.impact) / maxImpact) * 100;

              return (
                <div key={`${feature.raw_feature}-${idx}`}>
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-700">
                      {feature.feature}
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        positive ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {feature.impact > 0 ? "+" : ""}
                      {feature.impact.toFixed(4)}
                    </p>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        positive ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-1.5">
                    {feature.description} (Encoded value: {feature.encoded_value})
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-red-700">
            <TrendingUp size={21} />
            <h3 className="font-bold">Positive SHAP Value (+)</h3>
          </div>
          <p className="text-sm text-red-800 mt-3 leading-6">
            A positive SHAP value pushes the model output toward the Dropout
            class (higher predicted risk).
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-green-700">
            <TrendingDown size={21} />
            <h3 className="font-bold">Negative SHAP Value (-)</h3>
          </div>
          <p className="text-sm text-green-800 mt-3 leading-6">
            A negative SHAP value pushes the model output away from the Dropout
            class (protective factor).
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
        <Info size={22} className="text-amber-600 shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900">
            Important Interpretation Note
          </h3>
          <p className="text-sm text-amber-800 mt-2 leading-6">
            SHAP values explain model behaviour; they do not establish causation
            or represent percentage-point changes in dropout probability.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={16} />
        <span>Live explanations generated by backend SHAP TreeExplainer API.</span>
      </div>
    </div>
  );
}

export default Explainability;
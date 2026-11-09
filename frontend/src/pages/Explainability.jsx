
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Info,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const sampleFeatures = [
  {
    name: "1st Semester Approved Units",
    impact: 0.613,
    direction: "positive",
    description: "Higher approved units push the model away from Dropout.",
  },
  {
    name: "Mother's Occupation (Category 191)",
    impact: -0.698,
    direction: "negative",
    description: "This encoded category contributed negatively to the model output.",
  },
  {
    name: "Father's Qualification (Category 40)",
    impact: 0.378,
    direction: "positive",
    description: "This encoded category contributed positively to the model output.",
  },
  {
    name: "1st Semester Enrolled Units",
    impact: -0.369,
    direction: "negative",
    description: "This feature reduced the model output for Dropout in the examined record.",
  },
  {
    name: "Semester Grade",
    impact: 0.197,
    direction: "positive",
    description: "The student's semester grade contributed positively to the Dropout output.",
  },
];

function Explainability() {
  const maxImpact = Math.max(
    ...sampleFeatures.map((feature) => Math.abs(feature.impact))
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Model Explainability
        </h2>

        <p className="text-slate-500 mt-2">
          Understand which features influence the XGBoost model's Dropout predictions.
        </p>
      </div>

      {/* Information Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4">
        <Brain size={28} className="text-purple-600 shrink-0" />

        <div>
          <h3 className="font-bold text-purple-900">
            SHAP-based Explainable AI
          </h3>

          <p className="text-sm text-purple-800 mt-1 leading-6">
            SHAP (SHapley Additive exPlanations) estimates how individual
            input features contribute to a model prediction.
          </p>
        </div>
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">ML Model</p>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            XGBoost
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Explainability Method</p>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            SHAP TreeExplainer
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Input Features</p>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            231 Encoded Features
          </h3>
        </div>

      </div>

      {/* Feature Impact */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={23} className="text-blue-600" />

          <h3 className="text-lg font-bold text-slate-800">
            Feature Contribution Analysis
          </h3>
        </div>

        <p className="text-sm text-slate-500 mb-8">
          Illustrative contributions from the saved SHAP explanation output.
        </p>

        <div className="space-y-7">

          {sampleFeatures.map((feature) => {
            const positive = feature.direction === "positive";
            const width = (Math.abs(feature.impact) / maxImpact) * 100;

            return (
              <div key={feature.name}>

                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    {feature.name}
                  </p>

                  <p className={`text-sm font-bold ${
                    positive ? "text-red-600" : "text-green-600"
                  }`}>
                    {feature.impact > 0 ? "+" : ""}
                    {feature.impact.toFixed(3)}
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

                <p className="text-xs text-slate-500 mt-2">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>
      </section>

      {/* Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-red-700">
            <TrendingUp size={21} />
            <h3 className="font-bold">Positive SHAP Value</h3>
          </div>

          <p className="text-sm text-red-800 mt-3 leading-6">
            A positive SHAP value pushes the model output towards the
            Dropout class for the explained prediction.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-green-700">
            <TrendingDown size={21} />
            <h3 className="font-bold">Negative SHAP Value</h3>
          </div>

          <p className="text-sm text-green-800 mt-3 leading-6">
            A negative SHAP value pushes the model output away from
            the Dropout class for the explained prediction.
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
            SHAP values explain model behaviour; they do not establish
            causation or represent percentage-point changes in dropout
            probability. Demographic and family-related features also
            require fairness review before operational use.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={16} />
        <span>Current values are illustrative saved-example results, not live API explanations.</span>
      </div>

    </div>
  );
}

export default Explainability;


import {
  HeartHandshake,
  BookOpen,
  Wallet,
  Users,
  AlertTriangle,
  CheckCircle,
  CalendarCheck,
} from "lucide-react";

const sampleRecommendations = [
  {
    category: "Academic Support",
    issue: "Low semester grade",
    action:
      "Arrange subject-specific tutoring, faculty guidance and regular progress reviews.",
    priority: "High",
    icon: BookOpen,
  },
  {
    category: "Faculty Counselling",
    issue: "Model predicts Dropout",
    action:
      "Arrange a confidential counselling session to understand the student's difficulties and agree on a support plan.",
    priority: "High",
    icon: Users,
  },
  {
    category: "Financial Support",
    issue: "Potential financial difficulty",
    action:
      "Refer the student to the financial aid office to discuss scholarships, fee instalments or available assistance.",
    priority: "Medium",
    icon: Wallet,
  },
];

function Counselling() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Student Counselling Centre
        </h2>
        <p className="text-slate-500 mt-2">
          Review suggested interventions to support students who may be at risk.
        </p>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">
        <HeartHandshake className="text-blue-600 shrink-0" size={28} />

        <div>
          <h3 className="font-bold text-blue-900">
            Student Support Recommendations
          </h3>
          <p className="text-sm text-blue-800 mt-1 leading-6">
            Recommendations are generated from academic indicators,
            financial information and model predictions. A qualified
            staff member should review them before taking action.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Suggested Interventions
          </p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">
            3
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            High Priority
          </p>
          <h3 className="text-3xl font-bold text-red-600 mt-2">
            2
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Medium Priority
          </p>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">
            1
          </h3>
        </div>

      </div>

      {/* Recommendations */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck className="text-blue-600" size={24} />

          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Recommended Support Actions
            </h3>
            <p className="text-sm text-slate-500">
              Illustrative sample recommendations
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {sampleRecommendations.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl p-5"
              >
                <div className="flex flex-wrap justify-between gap-3">

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">
                        {item.category}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {item.issue}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-2 rounded-full h-fit ${
                      item.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.priority} Priority
                  </span>

                </div>

                <div className="mt-5 bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Suggested Action
                  </p>

                  <p className="text-sm text-slate-700 mt-2 leading-6">
                    {item.action}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <AlertTriangle size={15} />
                  Requires staff review before implementation
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* Footer Notice */}
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle className="text-green-600 shrink-0" size={20} />

        <p className="text-sm text-green-800">
          The system supports human decision-making. It does not
          automatically make academic or administrative decisions.
        </p>
      </div>

    </div>
  );
}

export default Counselling;

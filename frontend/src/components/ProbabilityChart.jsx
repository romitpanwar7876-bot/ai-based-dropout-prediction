
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProbabilityChart({ probabilities }) {
  const chartData = [
    {
      outcome: "Dropout",
      probability: probabilities?.Dropout ?? 0,
    },
    {
      outcome: "Enrolled",
      probability: probabilities?.Enrolled ?? 0,
    },
    {
      outcome: "Graduate",
      probability: probabilities?.Graduate ?? 0,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Student Outcome Probabilities
      </h3>

      <p className="text-sm text-slate-500 mb-6">
        Model-estimated probabilities for each outcome
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="outcome" />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(2)}%`,
                "Probability",
              ]}
            />

            <Bar
              dataKey="probability"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default ProbabilityChart;

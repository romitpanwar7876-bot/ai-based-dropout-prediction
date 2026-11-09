
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# 1. Load dataset
data = pd.read_csv("dataset/raw/student_dropout.csv")

# 2. Create output folder
output_dir = Path("eda_outputs")
output_dir.mkdir(exist_ok=True)

print("Starting Exploratory Data Analysis...")

# --------------------------------
# GRAPH 1: Target Distribution
# --------------------------------

target_counts = data["Target"].value_counts()

plt.figure(figsize=(8, 5))
target_counts.plot(kind="bar")

plt.title("Student Outcome Distribution")
plt.xlabel("Student Outcome")
plt.ylabel("Number of Students")
plt.xticks(rotation=0)
plt.tight_layout()

plt.savefig(output_dir / "target_distribution.png")
plt.show()

# --------------------------------
# GRAPH 2: Target Percentages
# --------------------------------

plt.figure(figsize=(7, 7))

target_counts.plot(
    kind="pie",
    autopct="%1.1f%%",
    startangle=90
)

plt.title("Student Outcome Percentage")
plt.ylabel("")
plt.tight_layout()

plt.savefig(output_dir / "target_percentage.png")
plt.show()

# --------------------------------
# GRAPH 3: Academic Performance
# --------------------------------

features = [
    "Curricular units 1st sem (approved)",
    "Curricular units 2nd sem (approved)",
    "Curricular units 1st sem (grade)",
    "Curricular units 2nd sem (grade)"
]

for feature in features:

    if feature in data.columns:

        plt.figure(figsize=(8, 5))

        data.boxplot(
            column=feature,
            by="Target"
        )

        plt.title(f"{feature} by Student Outcome")
        plt.suptitle("")
        plt.xlabel("Student Outcome")
        plt.ylabel(feature)

        plt.tight_layout()

        filename = feature.replace(" ", "_").replace("/", "_")

        plt.savefig(output_dir / f"{filename}.png")
        plt.show()

print("\nEDA Visualization Completed!")

print("Charts saved inside:", output_dir)


import joblib
import shap
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from pathlib import Path


# ==========================================
# 1. LOAD MODEL AND PREPROCESSOR
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(
    BASE_DIR / "artifacts/models/xgboost.pkl"
)

artifacts = joblib.load(
    BASE_DIR / "artifacts/preprocessing_artifacts.pkl"
)

preprocessor = artifacts["preprocessor"]
feature_names = artifacts["feature_names"]
classes = list(artifacts["classes"])

dataset_path = (
    BASE_DIR / "dataset/processed/early_warning_dataset.csv"
)

output_dir = BASE_DIR / "artifacts/explainability"
output_dir.mkdir(parents=True, exist_ok=True)


# ==========================================
# 2. LOAD SAMPLE STUDENT
# ==========================================

data = pd.read_csv(dataset_path)

student = data.drop(columns=["Target"]).iloc[[0]]

print("Student information loaded!")


# ==========================================
# 3. PREPROCESS STUDENT DATA
# ==========================================

processed_student = preprocessor.transform(student)

if hasattr(processed_student, "toarray"):
    processed_student = processed_student.toarray()

processed_student = np.asarray(processed_student)

student_df = pd.DataFrame(
    processed_student,
    columns=feature_names
)


# ==========================================
# 4. GENERATE SHAP VALUES
# ==========================================

print("Calculating individual SHAP values...")

explainer = shap.TreeExplainer(model)

shap_values = explainer.shap_values(student_df)

dropout_index = classes.index("Dropout")

if isinstance(shap_values, list):

    dropout_values = np.asarray(
        shap_values[dropout_index]
    )[0]

else:

    shap_values = np.asarray(shap_values)

    if shap_values.ndim == 3:

        dropout_values = shap_values[
            0, :, dropout_index
        ]

    elif shap_values.ndim == 2:

        dropout_values = shap_values[0]

    else:
        raise ValueError(
            "Unexpected SHAP output dimensions"
        )


# ==========================================
# 5. CALCULATE FEATURE CONTRIBUTIONS
# ==========================================

explanation = pd.DataFrame({
    "Feature": feature_names,
    "Student_Value": student_df.iloc[0].values,
    "SHAP_Value": dropout_values
})

explanation["Importance"] = (
    explanation["SHAP_Value"].abs()
)

explanation = explanation.sort_values(
    by="Importance",
    ascending=False
)

print("\nTOP 10 DROPOUT INFLUENCING FEATURES")

print(
    explanation[
        ["Feature", "Student_Value", "SHAP_Value"]
    ].head(10).to_string(index=False)
)


# ==========================================
# 6. SAVE EXPLANATION
# ==========================================

explanation.to_csv(
    output_dir / "individual_student_shap.csv",
    index=False
)


# ==========================================
# 7. CREATE VISUALIZATION
# ==========================================

top_features = explanation.head(10).sort_values(
    "SHAP_Value"
)

plt.figure(figsize=(10, 6))

plt.barh(
    top_features["Feature"],
    top_features["SHAP_Value"]
)

plt.axvline(0, color="black", linewidth=0.8)

plt.xlabel("SHAP Contribution to Dropout Model Output")

plt.title("Individual Student Dropout Explanation")

plt.tight_layout()

plt.savefig(
    output_dir / "individual_student_shap.png",
    dpi=300
)

plt.close()

print("\nIndividual SHAP explanation completed!")

print("Results saved in:", output_dir)

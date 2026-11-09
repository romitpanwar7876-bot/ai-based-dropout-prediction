
import joblib
import shap
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

print("Starting SHAP Explainable AI...")

# 1. Define paths
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "artifacts" / "models" / "xgboost.pkl"

ARTIFACT_PATH = BASE_DIR / "artifacts" / "preprocessing_artifacts.pkl"

OUTPUT_DIR = BASE_DIR / "artifacts" / "explainability"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# 2. Load trained model
model = joblib.load(MODEL_PATH)

print("XGBoost model loaded successfully!")


# 3. Load preprocessing artifacts
artifacts = joblib.load(ARTIFACT_PATH)

X_test = artifacts["X_test"]
feature_names = artifacts["feature_names"]
classes = artifacts["classes"]

# Convert test data into DataFrame

# Convert sparse matrix into a dense NumPy array
if hasattr(X_test, "toarray"):
    X_test = X_test.toarray()

# Convert into NumPy array
X_test = np.asarray(X_test)

print("X_test type:", type(X_test))
print("X_test shape:", X_test.shape)
print("Feature names:", len(feature_names))

# Validate dimensions
if X_test.ndim != 2:
    raise ValueError("X_test must be a 2D array")

if X_test.shape[1] != len(feature_names):
    raise ValueError(
        f"Feature mismatch: X_test has {X_test.shape[1]} "
        f"columns but feature_names has {len(feature_names)}"
    )

# Create DataFrame
X_test_df = pd.DataFrame(
    X_test,
    columns=feature_names
)

print("DataFrame created successfully!")
print("Final shape:", X_test_df.shape)

print("Test data shape:", X_test_df.shape)
print("Classes:", classes)


# 4. Select a small sample for SHAP
X_sample = X_test_df.sample(
    n=min(100, len(X_test_df)),
    random_state=42
)


# 5. Create SHAP explainer
explainer = shap.TreeExplainer(model)

shap_values = explainer.shap_values(X_sample)

print("SHAP values calculated successfully!")


# 6. Identify Dropout class
dropout_index = list(classes).index("Dropout")

# Handle multiclass SHAP output
if isinstance(shap_values, list):
    dropout_shap = shap_values[dropout_index]

else:
    values = np.asarray(shap_values)

    if values.ndim == 3:
        dropout_shap = values[:, :, dropout_index]
    else:
        dropout_shap = values


# 7. Global Feature Importance
print("Generating feature importance...")

shap.summary_plot(
    dropout_shap,
    X_sample,
    feature_names=feature_names,
    plot_type="bar",
    show=False
)

plt.title("Top Features Influencing Dropout Prediction")

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "dropout_feature_importance.png",
    dpi=300
)

plt.close()


# 8. SHAP Summary Plot
print("Generating SHAP summary plot...")

shap.summary_plot(
    dropout_shap,
    X_sample,
    feature_names=feature_names,
    show=False
)

plt.title("SHAP Summary - Dropout Prediction")

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "dropout_shap_summary.png",
    dpi=300
)

plt.close()


# 9. Individual Student Explanation
student_index = 0

student_shap = dropout_shap[student_index]

importance = pd.DataFrame({
    "Feature": feature_names,
    "SHAP_Value": student_shap
})

importance["Absolute_Importance"] = (
    importance["SHAP_Value"].abs()
)

importance = importance.sort_values(
    by="Absolute_Importance",
    ascending=False
)

print("\nTop 10 factors for selected student:")

print(
    importance[
        ["Feature", "SHAP_Value"]
    ].head(10)
)

importance.to_csv(
    OUTPUT_DIR / "individual_student_explanation.csv",
    index=False
)

print("\nSHAP Explainability Completed!")

print("Results saved in:", OUTPUT_DIR)

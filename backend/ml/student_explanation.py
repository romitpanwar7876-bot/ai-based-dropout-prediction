import joblib
import shap
import numpy as np
import pandas as pd
from pathlib import Path


# ==========================================
# 1. LOAD MODEL AND PREPROCESSOR
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "artifacts" / "models" / "xgboost.pkl"
ARTIFACT_PATH = BASE_DIR / "artifacts" / "preprocessing_artifacts.pkl"
DATASET_PATH = (
    BASE_DIR / "dataset" / "processed" / "early_warning_dataset.csv"
)

model = joblib.load(MODEL_PATH)
artifacts = joblib.load(ARTIFACT_PATH)

preprocessor = artifacts["preprocessor"]
feature_names = list(artifacts["feature_names"])
classes = list(artifacts["classes"])

input_columns = pd.read_csv(
    DATASET_PATH,
    nrows=0
).columns.drop("Target").tolist()

explainer = shap.TreeExplainer(model)


# ==========================================
# 2. REAL-TIME INDIVIDUAL SHAP EXPLANATION
# ==========================================

def explain_student_prediction(student_data: dict, top_n: int = 10) -> dict:
    """
    Calculate real-time SHAP feature contributions for an individual student
    with respect to the 'Dropout' class.
    """
    student_df = pd.DataFrame(
        [student_data],
        columns=input_columns
    )

    if student_df.isnull().any().any():
        missing_cols = student_df.columns[student_df.isnull().any()].tolist()
        raise ValueError(
            f"Student information contains missing values for: {missing_cols}"
        )

    processed_student = preprocessor.transform(student_df)

    if hasattr(processed_student, "toarray"):
        processed_student = processed_student.toarray()

    processed_student = np.asarray(processed_student)

    processed_df = pd.DataFrame(
        processed_student,
        columns=feature_names
    )

    # Prediction & probabilities
    prediction_idx = int(model.predict(processed_student)[0])
    predicted_outcome = classes[prediction_idx]

    probabilities = model.predict_proba(processed_student)[0]
    class_probabilities = {
        classes[int(class_id)]: round(float(prob) * 100, 2)
        for class_id, prob in zip(model.classes_, probabilities)
    }

    # SHAP values for Dropout class
    shap_values = explainer.shap_values(processed_df)
    dropout_index = classes.index("Dropout")

    if isinstance(shap_values, list):
        dropout_values = np.asarray(shap_values[dropout_index])[0]
    else:
        shap_arr = np.asarray(shap_values)
        if shap_arr.ndim == 3:
            dropout_values = shap_arr[0, :, dropout_index]
        elif shap_arr.ndim == 2:
            dropout_values = shap_arr[0]
        else:
            raise ValueError("Unexpected SHAP output dimensions")

    explanation_df = pd.DataFrame({
        "feature": feature_names,
        "encoded_value": processed_df.iloc[0].values,
        "shap_value": dropout_values,
        "abs_importance": np.abs(dropout_values),
    }).sort_values(by="abs_importance", ascending=False)

    top_df = explanation_df.head(top_n)

    top_factors = []
    for _, row in top_df.iterrows():
        val = round(float(row["shap_value"]), 4)
        direction = "positive" if val >= 0 else "negative"
        clean_name = str(row["feature"]).replace("__", " — ").replace("_", " ")

        description = (
            f"Increases Dropout risk contribution (+{val:.4f}) in the model."
            if val >= 0
            else f"Reduces Dropout risk contribution ({val:.4f}) in the model."
        )

        top_factors.append({
            "feature": clean_name,
            "raw_feature": str(row["feature"]),
            "encoded_value": round(float(row["encoded_value"]), 4),
            "impact": val,
            "direction": direction,
            "description": description,
        })

    return {
        "predicted_outcome": predicted_outcome,
        "class_probabilities": class_probabilities,
        "total_encoded_features": len(feature_names),
        "top_factors": top_factors,
    }


# ==========================================
# 3. STANDALONE TEST EXECUTION
# ==========================================

if __name__ == "__main__":
    sample_df = pd.read_csv(DATASET_PATH, nrows=1).drop(columns=["Target"])
    sample_student = sample_df.iloc[0].to_dict()
    res = explain_student_prediction(sample_student, top_n=10)
    print("Predicted Outcome:", res["predicted_outcome"])
    print("Probabilities:", res["class_probabilities"])
    print("\nTop SHAP Factors:")
    for item in res["top_factors"]:
        print(f" - {item['feature']}: {item['impact']:+.4f}")
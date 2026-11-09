
import joblib
import pandas as pd
from pathlib import Path


# ==========================================
# 1. PROJECT PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "artifacts" / "models" / "xgboost.pkl"

ARTIFACT_PATH = (
    BASE_DIR / "artifacts" / "preprocessing_artifacts.pkl"
)

DATASET_PATH = (
    BASE_DIR / "dataset" / "processed" /
    "early_warning_dataset.csv"
)


# ==========================================
# 2. LOAD MODEL AND PREPROCESSOR
# ==========================================

print("Loading prediction system...")

model = joblib.load(MODEL_PATH)

artifacts = joblib.load(ARTIFACT_PATH)

preprocessor = artifacts["preprocessor"]

classes = artifacts["classes"]

# Get original 30 input columns
input_columns = pd.read_csv(
    DATASET_PATH,
    nrows=0
).columns.drop("Target").tolist()

print("Model loaded successfully!")
print("Preprocessor loaded successfully!")
print("Input features:", len(input_columns))


# ==========================================
# 3. STUDENT PREDICTION FUNCTION
# ==========================================

def predict_student(student_data):

    # Convert dictionary into DataFrame
    student_df = pd.DataFrame(
        [student_data],
        columns=input_columns
    )

    # Check missing values
    if student_df.isnull().any().any():
        raise ValueError(
            "Student information contains missing values."
        )

    # Apply the SAME preprocessing used during training
    processed_data = preprocessor.transform(student_df)

    # Predict encoded class
    prediction = int(model.predict(processed_data)[0])

    # Convert encoded prediction into original label
    predicted_label = classes[prediction]

    # Calculate probabilities
    probabilities = model.predict_proba(processed_data)[0]

    # Match probability with its corresponding class
    class_probabilities = {
        classes[int(class_id)]: round(float(probability) * 100, 2)
        for class_id, probability in zip(
            model.classes_,
            probabilities
        )
    }

    return {
        "predicted_outcome": predicted_label,
        "class_probabilities": class_probabilities
    }


# ==========================================
# 4. TEST WITH ONE STUDENT RECORD
# ==========================================

if __name__ == "__main__":

    # Load one sample student record
    sample_df = pd.read_csv(
        DATASET_PATH,
        nrows=1
    )

    # Remove target column
    sample_df = sample_df.drop(columns=["Target"])

    # Convert into dictionary
    sample_student = sample_df.iloc[0].to_dict()

    # Generate prediction
    result = predict_student(sample_student)

    print("\n" + "=" * 45)
    print("STUDENT DROPOUT PREDICTION RESULT")
    print("=" * 45)

    print("\nPredicted Outcome:",
          result["predicted_outcome"])

    print("\nClass Probabilities:")

    for outcome, probability in result[
        "class_probabilities"
    ].items():

        print(f"{outcome}: {probability}%")

    print("\nPrediction completed successfully!")

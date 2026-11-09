
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)

# 1. Define paths
BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = BASE_DIR / "artifacts"
MODEL_DIR = ARTIFACT_DIR / "models"
OUTPUT_DIR = ARTIFACT_DIR / "evaluation"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 2. Load preprocessing artifacts
artifacts = joblib.load(
    ARTIFACT_DIR / "preprocessing_artifacts.pkl"
)

X_test = artifacts["X_test"]
y_test = artifacts["y_test"]
classes = artifacts["classes"]

class_names = [str(c) for c in classes]

print("Test data loaded:", X_test.shape)
print("Classes:", classes)

# 3. Load trained models
models = {
    "Logistic Regression": joblib.load(
        MODEL_DIR / "logistic_regression.pkl"
    ),
    "Random Forest": joblib.load(
        MODEL_DIR / "random_forest.pkl"
    ),
    "XGBoost": joblib.load(
        MODEL_DIR / "xgboost.pkl"
    )
}

# 4. Evaluate every model
for model_name, model in models.items():

    print("\n" + "=" * 60)
    print("MODEL:", model_name)
    print("=" * 60)

    # Generate predictions
   # Generate numerical predictions
    y_pred_encoded = model.predict(X_test)

# Convert numerical predictions into original text labels
    y_pred = [classes[int(label)] for label in y_pred_encoded]
    print("Actual labels:", y_test[:10])
    print("Predicted labels:", y_pred[:10])

    print("Actual label type:", y_test.dtype)
    print("Predicted label type:", type(y_pred))

    print("Actual unique labels:", set(y_test))
    print("Predicted unique labels:", set(y_pred))


    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {accuracy:.4f}")

    # Classification report
    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            y_pred,
            labels=classes,
            target_names=class_names,
            zero_division=0
        )
    )

    # Confusion matrix
    cm = confusion_matrix(
        y_test,
        y_pred,
        labels=classes
    )

    plt.figure(figsize=(7, 5))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names
    )

    plt.title(f"{model_name} - Confusion Matrix")
    plt.xlabel("Predicted Label")
    plt.ylabel("Actual Label")
    plt.tight_layout()

    # Save confusion matrix
    filename = model_name.lower().replace(" ", "_")
    plt.savefig(OUTPUT_DIR / f"{filename}_confusion_matrix.png")

    plt.close()

print("\nAll model evaluations completed!")
print("Results saved in:", OUTPUT_DIR)

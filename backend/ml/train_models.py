
import joblib
import json
from pathlib import Path

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score
)

from xgboost import XGBClassifier


# =====================================
# 1. LOAD PREPROCESSING ARTIFACTS
# =====================================

artifacts = joblib.load(
    "artifacts/preprocessing_artifacts.pkl"
)

X_train = artifacts["X_train"]
X_test = artifacts["X_test"]

y_train = artifacts["y_train"]
y_test = artifacts["y_test"]

print("Training data:", X_train.shape)
print("Testing data:", X_test.shape)


# =====================================
# 2. ENCODE TARGET LABELS
# =====================================

classes = artifacts["classes"]

class_to_number = {
    label: index
    for index, label in enumerate(classes)
}

y_train_encoded = y_train.map(class_to_number)
y_test_encoded = y_test.map(class_to_number)


# =====================================
# 3. DEFINE MODELS
# =====================================

models = {

    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        class_weight="balanced"
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="multi:softprob",
        num_class=len(classes),
        eval_metric="mlogloss",
        random_state=42,
        n_jobs=-1
    )
}


# =====================================
# 4. TRAIN AND EVALUATE MODELS
# =====================================

results = {}

output_dir = Path("artifacts/models")
output_dir.mkdir(parents=True, exist_ok=True)

for name, model in models.items():

    print("\n" + "=" * 50)
    print("Training:", name)

    model.fit(X_train, y_train_encoded)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test_encoded,
        predictions
    )

    weighted_f1 = f1_score(
        y_test_encoded,
        predictions,
        average="weighted"
    )

    macro_f1 = f1_score(
        y_test_encoded,
        predictions,
        average="macro"
    )

    print("Accuracy:", round(accuracy, 4))
    print("Weighted F1:", round(weighted_f1, 4))
    print("Macro F1:", round(macro_f1, 4))

    print("\nClassification Report:")

    print(
        classification_report(
            y_test_encoded,
            predictions,
            labels=list(range(len(classes))),
            target_names=classes,
            zero_division=0
        )
    )

    print("Confusion Matrix:")

    print(
        confusion_matrix(
            y_test_encoded,
            predictions
        )
    )

    results[name] = {
        "accuracy": float(accuracy),
        "weighted_f1": float(weighted_f1),
        "macro_f1": float(macro_f1)
    }

    joblib.dump(
        model,
        output_dir / (
            name.lower().replace(" ", "_") + ".pkl"
        )
    )


# =====================================
# 5. SAVE MODEL COMPARISON
# =====================================

with open(
    output_dir / "model_comparison.json",
    "w"
) as file:

    json.dump(results, file, indent=4)


print("\nAll models trained successfully!")

print("Models saved in:", output_dir)

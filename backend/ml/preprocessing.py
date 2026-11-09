
import pandas as pd
import numpy as np
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer


# ==========================================
# 1. LOAD SELECTED DATASET
# ==========================================

print("\nStarting Data Preprocessing...")

data = pd.read_csv(
    "dataset/processed/early_warning_dataset.csv"
)

print("Dataset Shape:", data.shape)


# ==========================================
# 2. SEPARATE INPUT AND TARGET
# ==========================================

X = data.drop(columns=["Target"])
y = data["Target"]


# ==========================================
# 3. CHECK MISSING VALUES
# ==========================================

print("\nMissing Values:")

print(X.isnull().sum().sum())


# ==========================================
# 4. CHECK DUPLICATES
# ==========================================

print("\nDuplicate Rows:")

print(data.duplicated().sum())

# We will investigate duplicates rather than
# automatically deleting potentially valid records.


# ==========================================
# 5. IDENTIFY CATEGORICAL FEATURES
# ==========================================

categorical_features = [
    "Marital Status",
    "Application mode",
    "Course",
    "Daytime/evening attendance",
    "Previous qualification",
    "Nacionality",
    "Mother's qualification",
    "Father's qualification",
    "Mother's occupation",
    "Father's occupation"
]


# ==========================================
# 6. IDENTIFY NUMERICAL FEATURES
# ==========================================

numerical_features = [
    col for col in X.columns
    if col not in categorical_features
]


# ==========================================
# 7. VALIDATE FEATURE NAMES
# ==========================================

missing_columns = (
    set(categorical_features) - set(X.columns)
)

if missing_columns:
    raise ValueError(
        f"Categorical columns missing: {missing_columns}"
    )

print("\nCategorical Features:", len(categorical_features))
print("Numerical Features:", len(numerical_features))


# ==========================================
# 8. CREATE NUMERICAL PIPELINE
# ==========================================

numerical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)


# ==========================================
# 9. CREATE CATEGORICAL PIPELINE
# ==========================================

categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ]
)


# ==========================================
# 10. COMBINE BOTH PIPELINES
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numerical_pipeline, numerical_features),
        ("cat", categorical_pipeline, categorical_features)
    ]
)


# ==========================================
# 11. TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining Samples:", len(X_train))
print("Testing Samples:", len(X_test))


# ==========================================
# 12. FIT ON TRAINING DATA ONLY
# ==========================================

X_train_processed = preprocessor.fit_transform(X_train)

X_test_processed = preprocessor.transform(X_test)


# ==========================================
# 13. DISPLAY FINAL SHAPES
# ==========================================

print("\nPreprocessing Results:")

print("Training Data:", X_train_processed.shape)
print("Testing Data:", X_test_processed.shape)


# ==========================================
# 14. SAVE PREPROCESSING ARTIFACTS
# ==========================================

output_dir = Path("artifacts")

output_dir.mkdir(exist_ok=True)

artifacts = {
    "preprocessor": preprocessor,
    "X_train": X_train_processed,
    "X_test": X_test_processed,
    "y_train": y_train,
    "y_test": y_test,
    "feature_names": preprocessor.get_feature_names_out(),
    "classes": sorted(y.unique().tolist())
}

joblib.dump(
    artifacts,
    output_dir / "preprocessing_artifacts.pkl"
)

print("\nPreprocessing Completed Successfully!")

print("Artifacts saved in:", output_dir)

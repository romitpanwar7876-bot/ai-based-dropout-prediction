
import pandas as pd
from pathlib import Path

# ==========================================
# 1. LOAD ORIGINAL DATASET
# ==========================================

data = pd.read_csv("dataset/raw/student_dropout.csv")

print("Original Dataset Shape:", data.shape)


# ==========================================
# 2. IDENTIFY TARGET COLUMN
# ==========================================

target_column = "Target"

if target_column not in data.columns:
    raise ValueError("Target column not found!")

y = data[target_column]


# ==========================================
# 3. EXCLUDE SECOND SEMESTER FEATURES
# ==========================================

second_semester_features = [
    col for col in data.columns
    if col.lower().startswith("curricular units 2nd sem")
]

print("\nExcluded Second Semester Features:")

for feature in second_semester_features:
    print("-", feature)


# ==========================================
# 4. SELECT ADMISSION + FIRST SEMESTER
# ==========================================

selected_features = [
    col for col in data.columns
    if col != target_column
    and col not in second_semester_features
]

X = data[selected_features]


# ==========================================
# 5. COMBINE SELECTED FEATURES + TARGET
# ==========================================

processed_data = X.copy()
processed_data[target_column] = y


# ==========================================
# 6. DISPLAY SELECTED FEATURES
# ==========================================

print("\nSelected Features:")

for feature in selected_features:
    print("-", feature)


# ==========================================
# 7. DISPLAY DATASET INFORMATION
# ==========================================

print("\nOriginal Shape:", data.shape)

print("Selected Features Shape:", X.shape)

print("Final Dataset Shape:", processed_data.shape)


# ==========================================
# 8. CHECK TARGET DISTRIBUTION
# ==========================================

print("\nTarget Distribution:")

print(processed_data[target_column].value_counts())


# ==========================================
# 9. SAVE PROCESSED DATASET
# ==========================================

output_dir = Path("dataset/processed")
output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "early_warning_dataset.csv"

processed_data.to_csv(output_file, index=False)

print("\nFeature Selection Completed!")

print("Saved File:", output_file)

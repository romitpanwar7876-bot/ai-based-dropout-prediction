
import pandas as pd

# 1. Load dataset
data = pd.read_csv("dataset/raw/student_dropout.csv")

print("=" * 50)
print("STUDENT DROPOUT DATASET ANALYSIS")
print("=" * 50)

# 2. Dataset dimensions
print("\n1. DATASET SHAPE")
print(data.shape)

# 3. Column information
print("\n2. DATASET INFORMATION")
data.info()

# 4. Missing values
print("\n3. MISSING VALUES")
print(data.isnull().sum().sum())

# 5. Duplicate records
print("\n4. DUPLICATE RECORDS")
print(data.duplicated().sum())

# 6. Target distribution
print("\n5. TARGET DISTRIBUTION")
print(data["Target"].value_counts())

# 7. Target percentages
print("\n6. TARGET PERCENTAGES")
print(
    data["Target"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

# 8. Statistical summary
print("\n7. STATISTICAL SUMMARY")
print(data.describe().T)

# 9. Unique target classes
print("\n8. UNIQUE TARGET CLASSES")
print(data["Target"].unique())

print("\nEDA BASIC INSPECTION COMPLETED!")

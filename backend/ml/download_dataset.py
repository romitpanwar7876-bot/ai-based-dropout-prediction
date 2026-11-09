
from ucimlrepo import fetch_ucirepo
import pandas as pd
from pathlib import Path

# Step 1: Download dataset from UCI
print("Downloading Student Dropout Dataset...")

dataset = fetch_ucirepo(id=697)

# Step 2: Extract features and target
X = dataset.data.features
y = dataset.data.targets

# Step 3: Combine features and target
data = pd.concat([X, y], axis=1)

# Step 4: Create dataset folder
output_dir = Path("dataset/raw")
output_dir.mkdir(parents=True, exist_ok=True)

# Step 5: Save dataset
data.to_csv(output_dir / "student_dropout.csv", index=False)

# Step 6: Display information
print("\nDownload successful!")
print("Dataset shape:", data.shape)

print("\nFirst 5 records:")
print(data.head())

print("\nTarget distribution:")
print(data["Target"].value_counts())

print("\nDataset saved successfully!")

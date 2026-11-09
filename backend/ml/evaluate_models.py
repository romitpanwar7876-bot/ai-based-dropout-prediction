
import json

# Load model comparison results
with open("artifacts/models/model_comparison.json", "r") as file:
    results = json.load(file)

print("\nMODEL PERFORMANCE COMPARISON")
print("=" * 50)

for model_name, metrics in results.items():
    print(f"\nModel: {model_name}")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Weighted F1: {metrics['weighted_f1']:.4f}")
    print(f"Macro F1: {metrics['macro_f1']:.4f}")

print("\nEvaluation completed!")

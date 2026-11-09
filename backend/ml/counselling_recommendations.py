
from pathlib import Path
import pandas as pd

from ml.predict_student import predict_student


# ==========================================
# 1. COUNSELLING RECOMMENDATION ENGINE
# ==========================================

def generate_recommendations(student, prediction):

    recommendations = []

    # Academic information
    approved = student["Curricular units 1st sem (approved)"]
    enrolled = student["Curricular units 1st sem (enrolled)"]
    grade = student["Curricular units 1st sem (grade)"]

    # Financial information
    debtor = student["Debtor"]
    tuition_status = student["Tuition fees up to date"]
    scholarship = student["Scholarship holder"]


    # ======================================
    # 2. ACADEMIC PERFORMANCE ANALYSIS
    # ======================================

    approval_rate = (
        approved / enrolled if enrolled > 0 else 0
    )

    if enrolled > 0 and approval_rate < 0.50:

        recommendations.append({
            "category": "Academic Support",
            "issue": "Low subject approval rate",
            "action": (
                "Arrange academic mentoring, identify "
                "difficult subjects and create a study plan."
            ),
            "priority": "High"
        })

    if grade < 10:

        recommendations.append({
            "category": "Academic Support",
            "issue": "Low semester grade",
            "action": (
                "Arrange subject-specific tutoring, "
                "faculty guidance and regular progress reviews."
            ),
            "priority": "High"
        })


    # ======================================
    # 3. FINANCIAL ANALYSIS
    # ======================================

    if debtor == 1 or tuition_status == 0:

        recommendations.append({
            "category": "Financial Support",
            "issue": "Potential financial difficulty",
            "action": (
                "Refer the student to the financial aid office "
                "to discuss scholarships, fee instalments "
                "or available assistance."
            ),
            "priority": "High"
        })

    if (debtor == 1 or tuition_status == 0) and scholarship == 0:

        recommendations.append({
            "category": "Scholarship Assistance",
            "issue": "No recorded scholarship",
            "action": (
                "Check scholarship eligibility and "
                "available financial support programmes."
            ),
            "priority": "Medium"
        })


    # ======================================
    # 4. MODEL PREDICTION BASED ACTION
    # ======================================

    predicted_outcome = prediction["predicted_outcome"]

    if predicted_outcome == "Dropout":

        recommendations.append({
            "category": "Faculty Counselling",
            "issue": "Model predicts Dropout",
            "action": (
                "Arrange a confidential counselling session "
                "to understand the student's difficulties "
                "and agree on a support plan."
            ),
            "priority": "High"
        })

    elif predicted_outcome == "Enrolled":

        recommendations.append({
            "category": "Student Monitoring",
            "issue": "Model predicts Enrolled",
            "action": (
                "Check academic progress and identify "
                "any barriers to successful completion."
            ),
            "priority": "Medium"
        })


    # ======================================
    # 5. GENERAL FOLLOW-UP
    # ======================================

    if not recommendations:

        recommendations.append({
            "category": "General Guidance",
            "issue": "No predefined intervention trigger",
            "action": (
                "Continue routine academic mentoring "
                "and periodic student check-ins."
            ),
            "priority": "Low"
        })

    return recommendations


# ==========================================
# 6. TEST COUNSELLING ENGINE
# ==========================================

if __name__ == "__main__":

    BASE_DIR = Path(__file__).resolve().parent.parent

    dataset_path = (
        BASE_DIR /
        "dataset" /
        "processed" /
        "early_warning_dataset.csv"
    )

    # Load sample student
    data = pd.read_csv(dataset_path)

    student = (
        data.drop(columns=["Target"])
        .iloc[0]
        .to_dict()
    )

    # Generate prediction
    prediction = predict_student(student)

    # Generate recommendations
    recommendations = generate_recommendations(
        student,
        prediction
    )

    # Display results
    print("\n" + "=" * 55)
    print("AI STUDENT COUNSELLING RECOMMENDATION SYSTEM")
    print("=" * 55)

    print("\nPredicted Outcome:",
          prediction["predicted_outcome"])

    print("\nCOUNSELLING RECOMMENDATIONS")

    for index, item in enumerate(recommendations, 1):

        print(f"\n{index}. {item['category']}")

        print("Issue:", item["issue"])

        print("Action:", item["action"])

        print("Priority:", item["priority"])

    print("\nCounselling analysis completed!")

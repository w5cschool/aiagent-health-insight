def validate_patient_data(patient_id, patient_name, age, gender, date_of_report, chief_complaint):
    if not all([patient_id, patient_name, age, gender, date_of_report, chief_complaint]):
        return False, "Please fill in all required fields"
    return True, None

def validate_vital_signs(systolic_bp, diastolic_bp):
    if not isinstance(systolic_bp, (int, float)) or not isinstance(diastolic_bp, (int, float)):
        return False, "Please enter valid blood pressure values"
    return True, None 
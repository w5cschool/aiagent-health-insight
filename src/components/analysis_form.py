import streamlit as st
from services.ai_service import generate_analysis
from config.prompts import SPECIALIST_PROMPTS
from utils.pdf_extractor import extract_text_from_pdf
from config.sample_data import SAMPLE_REPORT

def show_analysis_form():
    report_source = st.radio(
        "Choose report source",
        ["Upload PDF", "Use Sample PDF"],
        horizontal=True
    )

    pdf_contents = get_report_contents(report_source)
            
    if pdf_contents:  # Only show form if we have report content
        render_patient_form(pdf_contents)

def get_report_contents(report_source):
    if report_source == "Upload PDF":
        uploaded_file = st.file_uploader("Upload blood report PDF", type=['pdf'])
        if uploaded_file:
            pdf_contents = extract_text_from_pdf(uploaded_file)
            with st.expander("View Extracted Report"):
                st.text(pdf_contents)
            return pdf_contents
    else:
        with st.expander("View Sample Report"):
            st.text(SAMPLE_REPORT)
        return SAMPLE_REPORT
    return None

def render_patient_form(pdf_contents):
    with st.form("analysis_form"):
        patient_name = st.text_input("Patient Name")
        col1, col2 = st.columns(2)
        with col1:
            age = st.number_input("Age", min_value=0, max_value=120)
        with col2:
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        
        if st.form_submit_button("Analyze Report"):
            handle_form_submission(patient_name, age, gender, pdf_contents)

def handle_form_submission(patient_name, age, gender, pdf_contents):
    if not all([patient_name, age, gender]):
        st.error("Please fill in all fields")
        return

    with st.spinner("Analyzing report..."):
        # Save user message
        st.session_state.auth_service.save_chat_message(
            st.session_state.current_session['id'],
            f"Analyzing report for patient: {patient_name}"
        )
        
        # Generate and save analysis
        analysis = generate_analysis({
            "patient_name": patient_name,
            "age": age,
            "gender": gender,
            "report": pdf_contents
        }, SPECIALIST_PROMPTS["comprehensive_analyst"])
        
        st.session_state.auth_service.save_chat_message(
            st.session_state.current_session['id'],
            analysis,
            role='assistant'
        )
        st.rerun()

import streamlit as st
from config.prompts import SPECIALIST_PROMPTS
from services.ai_service import generate_analysis
import pdfplumber
from io import BytesIO

def extract_text_from_pdf(pdf_file):
    text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def main():
    st.set_page_config(page_title="Blood Report Analysis System", layout="wide")
    
    # Sidebar
    st.markdown("""
        <style>
        .sidebar .sidebar-content {
            background-image: linear-gradient(#2e7bcf,#2e7bcf);
            color: white;
        }
        .sidebar-content a {
            color: #ffffff !important;
            text-decoration: none;
            padding: 8px 0;
            display: inline-block;
            transition: transform 0.2s;
        }
        .sidebar-content a:hover {
            transform: translateX(5px);
            text-decoration: none;
        }
        .sidebar-content img {
            border-radius: 50%;
            margin: 20px 0;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.title("🩺 About")
        st.markdown("---")
        st.markdown("### 👨‍💻 Created by Harsh Gajjar")
        st.markdown("#### 🔗 Connect with me")
        
        cols = st.columns(3)
        with cols[0]:
            st.markdown("[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/harshhh28)")
        with cols[1]:
            st.markdown("[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/harsh-gajjar-936536209)")
        with cols[2]:
            st.markdown("[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/harshgajjar_28)")
        
        st.markdown("---")
        st.markdown("### 📊 Project Stats")
        st.markdown("- 🔬 AI-Powered Analysis")
        st.markdown("- 📄 PDF Report Support")
        st.markdown("- 🏥 Medical Insights")
    
    # Main content
    st.title("Blood Report Analysis System")
    
    # Basic Patient Info
    st.header("Patient Information")
    col1, col2 = st.columns(2)
    
    with col1:
        patient_name = st.text_input("Patient Name")
        age = st.number_input("Age", min_value=0, max_value=120)
    with col2:
        gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        date_of_report = st.date_input("Date of Report")

    # Blood Report Upload
    st.header("Blood Report")
    uploaded_file = st.file_uploader("Upload your blood report PDF", type=['pdf'])
    
    if uploaded_file is not None:
        pdf_contents = extract_text_from_pdf(uploaded_file)
        with st.expander("View Extracted Report Contents"):
            st.text(pdf_contents)
    
    if st.button("Analyze Report"):
        if uploaded_file is None:
            st.error("Please upload a blood report PDF")
        elif not patient_name or not age or not gender:
            st.error("Please fill in all patient information")
        else:
            with st.spinner("Analyzing blood report..."):
                patient_data = {
                    "patient_name": patient_name,
                    "age": age,
                    "gender": gender,
                    "date_of_report": date_of_report.strftime("%Y-%m-%d"),
                    "blood_report": pdf_contents
                }
                
                # Generate comprehensive analysis
                analysis = generate_analysis(patient_data, SPECIALIST_PROMPTS["comprehensive_analyst"])
                
                # Display results
                st.header("Analysis Results")
                st.markdown(analysis)
                
                # Add a download button for the report
                st.download_button(
                    label="Download Analysis Report",
                    data=analysis,
                    file_name=f"blood_report_analysis_{patient_name}_{date_of_report}.txt",
                    mime="text/plain"
                )

if __name__ == "__main__":
    main() 
import pdfplumber
import streamlit as st

def validate_pdf_size(file):
    MAX_SIZE_MB = 10
    if file.size > MAX_SIZE_MB * 1024 * 1024:
        return False, f"File size exceeds {MAX_SIZE_MB}MB limit"
    return True, None

def extract_text_from_pdf(pdf_file):
    try:
        # Validate file size
        is_valid, error = validate_pdf_size(pdf_file)
        if not is_valid:
            return error
            
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            if len(pdf.pages) > 50:
                return "PDF exceeds maximum page limit of 50"
                
            for page in pdf.pages:
                extracted = page.extract_text()
                if not extracted:
                    return "Could not extract text from PDF. Please ensure it's not a scanned document."
                text += extracted + "\n"
                
        if len(text.strip()) < 50:
            return "Extracted text is too short. Please ensure the PDF contains valid text."
            
        return text
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

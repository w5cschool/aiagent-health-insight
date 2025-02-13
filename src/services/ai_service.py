import streamlit as st
import groq
from datetime import datetime, timedelta

def check_rate_limit():
    if 'analysis_count' not in st.session_state:
        st.session_state.analysis_count = 0
        st.session_state.last_analysis = datetime.now()
    
    # Reset counter after 24 hours
    if datetime.now() - st.session_state.last_analysis > timedelta(days=1):
        st.session_state.analysis_count = 0
        st.session_state.last_analysis = datetime.now()
    
    # Check if limit reached (e.g., 10 analyses per day)
    if st.session_state.analysis_count >= 10:
        return False
    return True

def generate_analysis(data, system_prompt):
    if not check_rate_limit():
        st.error("Daily analysis limit reached. Please try again tomorrow.")
        return None
        
    try:
        client = groq.Groq(api_key=st.secrets["GROQ_API_KEY"])
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": str(data)}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        st.session_state.analysis_count += 1
        st.session_state.last_analysis = datetime.now()
        
        return completion.choices[0].message.content
    except Exception as e:
        st.error(f"Analysis failed: {str(e)}")
        return None
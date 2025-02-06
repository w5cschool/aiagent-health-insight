import streamlit as st
from groq import Groq

groq_client = Groq(api_key=st.secrets["GROQ_API_KEY"])

def generate_analysis(data, system_prompt):
    completion = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": str(data)}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    return completion.choices[0].message.content 
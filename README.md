# Medical Diagnosis System

An AI-powered medical diagnosis system that provides specialist analyses using the Groq LLM API.

## Features

- Multi-specialist analysis (Cardiologist, Pulmonologist, Psychologist)
- Vital signs monitoring
- Symptom tracking
- Comprehensive final diagnosis

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Add your Groq API key to `.streamlit/secrets.toml`
4. Run the application:
   ```bash
   streamlit run src/main.py
   ```

## Project Structure

```
├── src/
│   ├── config/
│   │   └── prompts.py
│   ├── services/
│   │   ├── ai_service.py
│   ├── utils/
│   │   ├── validators.py
│   └── main.py
├── .devcontainer/
│   └── devcontainer.json
├── requirements.txt
├── .gitignore
├── .streamlit/
│   └── secrets.toml
└── README.md
```

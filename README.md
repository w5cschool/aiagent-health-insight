# Medical Diagnosis System

An AI-powered medical diagnosis system that helps healthcare professionals analyze patient data and generate comprehensive medical reports. Built with Next.js, Firebase, and GROQ API.

Created by Harsh Gajjar

- GitHub: [@harshgajjar7110](https://github.com/harshhh28)
- LinkedIn: [harsh-gajjar](https://linkedin.com/in/harsh-gajjar-936536209)
- Twitter: [@harshgajjar7110](https://twitter.com/harshgajjar_28)

## Features

- 🏥 Patient Information Collection

  - Comprehensive form with validation
  - Vital signs monitoring
  - Symptom selection
  - Patient history tracking

- 🤖 AI-Powered Analysis

  - Multi-specialist analysis (Cardiologist, Pulmonologist, Psychologist)
  - Real-time processing using GROQ AI
  - Comprehensive diagnostic reports

- 📊 Report Generation
  - Professional PDF reports
  - Detailed analysis from multiple specialists
  - Easy download and sharing
  - Clean, medical-standard formatting

## Tech Stack

- **Framework**: Next.js 14
- **Database**: Firebase Firestore
- **AI/ML**: GROQ AI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **PDF Generation**: html2canvas + jsPDF

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GROQ_API_KEY=
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │   └── reports/
│   │   └── [id]/
│   └── page.tsx
├── components/
│   └── MedicalForm.tsx
├── lib/
│   └── firebase.ts
├── types/
│   └── index.ts
└── utils/
    └── generatePDF.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

# AI Interview Assistant

An intelligent interview practice platform powered by AI that provides personalized interview experiences based on your resume and target role.

## Features

- 🤖 **AI-Powered Resume Analysis**: Uses local LLM (Llama2) to parse and understand your resume
- 🎯 **Role-Based Questions**: Generates questions tailored to your target role and experience
- 📊 **Real-time Feedback**: Provides instant feedback on your responses
- 🎥 **Video Interview Practice**: Records and analyzes your interview responses
- 🔍 **Smart Question Generation**: Creates questions based on your skills and experience
- 🕒 **Flexible Scheduling**: Practice immediately or schedule for later

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **AI/ML**: Llama2, Ollama for local LLM processing
- **UI Components**: Shadcn UI
- **Media**: WebRTC for video/audio handling
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom animations

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/krishnamurthi-ramesh/ai-interview-assistant.git
```

2. Install dependencies:
```bash
cd ai-interview-assistant
npm install
```

3. Set up local LLM:
- Install Ollama from [https://ollama.ai/](https://ollama.ai/)
- Pull the Llama2 model:
```bash
ollama pull llama2
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   └── practice/         # Interview practice pages
├── components/            # Reusable components
├── services/             # Business logic and services
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Features in Detail

### Resume Analysis
- Intelligent parsing of PDF and DOC/DOCX resumes
- Extraction of skills, experience, and projects
- Role and domain suggestions based on experience

### Interview Questions
- Technical questions based on skills
- Behavioral questions adapted to experience level
- Project-specific questions from resume
- Role-specific scenario questions

### Real-time Features
- Live video recording
- Speech-to-text transcription
- Real-time feedback on:
  - Speaking pace
  - Confidence metrics
  - Answer structure
  - Technical accuracy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Collaborators

Krishnamurthi - [@krishnamurthi-ramesh](https://github.com/krishnamurthi-ramesh)
Vansh Angaria - [@Vansh-Angaria](https://github.com/VanshAngaria/ai-mock-interviewer)


import { useState, useEffect, useRef } from 'react';
import { InterviewService } from '@/utils/interview-service';

export function useInterview(type, role) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [analysis, setAnalysis] = useState({
    confidence: 0,
    clarity: 0,
    technicalAccuracy: 0,
  });
  const [error, setError] = useState(null);

  const interviewService = useRef(null);
  const mediaRecorder = useRef(null);
  const webcamRef = useRef(null);
  const videoAnalysisInterval = useRef(null);

  // Initialize interview session
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        interviewService.current = new InterviewService();
        await interviewService.current.initializeInterview(type, role);
        const firstQuestion = interviewService.current.getNextQuestion();
        setCurrentQuestion(firstQuestion);
        setIsInitialized(true);
      } catch (err) {
        setError('Failed to initialize interview: ' + err.message);
      }
    };

    if (!isInitialized) {
      initializeInterview();
    }

    return () => {
      if (videoAnalysisInterval.current) {
        clearInterval(videoAnalysisInterval.current);
      }
    };
  }, [type, role, isInitialized]);

  // Start recording and analysis
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Set up media recorder for voice analysis
      mediaRecorder.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks);
        const analysis = await interviewService.current.analyzeVoice(audioBlob);
        setFeedback((prev) => ({ ...prev, voice: analysis }));
      };

      // Start video analysis interval
      videoAnalysisInterval.current = setInterval(async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          const videoAnalysis = await interviewService.current.analyzeVideoFrame(
            imageSrc
          );
          setAnalysis((prev) => ({
            ...prev,
            confidence: videoAnalysis.confidence || prev.confidence,
          }));
        }
      }, 5000); // Analyze every 5 seconds

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
    }
  };

  // Stop recording and get final analysis
  const stopRecording = async () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);

      if (videoAnalysisInterval.current) {
        clearInterval(videoAnalysisInterval.current);
      }
    }
  };

  // Submit answer for analysis
  const submitAnswer = async (answer) => {
    try {
      const answerAnalysis = await interviewService.current.analyzeAnswer(
        answer,
        currentQuestion
      );
      
      setAnalysis((prev) => ({
        ...prev,
        technicalAccuracy: answerAnalysis.technicalAccuracy,
        clarity: answerAnalysis.clarity,
      }));

      const nextQuestion = interviewService.current.getNextQuestion();
      setCurrentQuestion(nextQuestion);

      return answerAnalysis;
    } catch (err) {
      setError('Failed to analyze answer: ' + err.message);
    }
  };

  // Get final feedback report
  const getFeedbackReport = async () => {
    try {
      const report = await interviewService.current.generateFeedbackReport();
      return report;
    } catch (err) {
      setError('Failed to generate feedback report: ' + err.message);
    }
  };

  // Get improvement suggestions
  const getImprovementSuggestions = async () => {
    try {
      const suggestions = await interviewService.current.getImprovementSuggestions();
      return suggestions;
    } catch (err) {
      setError('Failed to get improvement suggestions: ' + err.message);
    }
  };

  // Save interview session
  const saveSession = async () => {
    try {
      const sessionData = await interviewService.current.saveInterviewSession();
      return sessionData;
    } catch (err) {
      setError('Failed to save session: ' + err.message);
    }
  };

  return {
    isInitialized,
    currentQuestion,
    isRecording,
    feedback,
    analysis,
    error,
    webcamRef,
    startRecording,
    stopRecording,
    submitAnswer,
    getFeedbackReport,
    getImprovementSuggestions,
    saveSession,
  };
} 
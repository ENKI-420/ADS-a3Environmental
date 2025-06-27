"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseVoiceRecognitionProps {
  onTranscript: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

let SpeechRecognition: any = null
if (typeof window !== "undefined") {
  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
}

export const useVoiceRecognition = (
  onTranscript: (transcript: string) => void,
  options?: Omit<UseVoiceRecognitionProps, 'onTranscript'>
) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  const {
    onError,
    language = "en-US",
    continuous = true,
    interimResults = false
  } = options || {}

  useEffect(() => {
    if (!SpeechRecognition) {
      setError("Speech Recognition API not supported in this browser.")
      setIsSupported(false)
      onError?.("Speech Recognition API not supported in this browser.")
      return
    }

    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      retryCountRef.current = 0
    }

    recognition.onend = () => {
      setIsListening(false)

      // Auto-restart if it was supposed to be continuous and we haven't manually stopped
      if (continuous && recognitionRef.current && retryCountRef.current < maxRetries) {
        restartTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start()
              retryCountRef.current++
            } catch (err) {
              console.error("Failed to restart recognition:", err)
            }
          }
        }, 100)
      }
    }

    recognition.onerror = (event: any) => {
      const errorMessage = `Speech recognition error: ${event.error}`
      setError(errorMessage)
      setIsListening(false)

      console.error("Speech recognition error:", event.error, event.message)
      onError?.(errorMessage)

      // Handle specific errors
      if (event.error === 'not-allowed') {
        setError("Microphone access denied. Please allow microphone access and try again.")
        onError?.("Microphone access denied. Please allow microphone access and try again.")
      } else if (event.error === 'no-speech') {
        // This is common and not really an error, just restart
        if (retryCountRef.current < maxRetries) {
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start()
                retryCountRef.current++
              } catch (err) {
                console.error("Failed to restart after no-speech:", err)
              }
            }
          }, 100)
        }
      }
    }

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1]
      if (lastResult && lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim()
        if (transcript) {
          onTranscript(transcript)
          retryCountRef.current = 0 // Reset retry count on successful recognition
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
      if (recognition) {
        recognition.stop()
        recognition.onstart = null
        recognition.onend = null
        recognition.onerror = null
        recognition.onresult = null
      }
    }
  }, [onTranscript, onError, language, continuous, interimResults])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      const errorMsg = "Speech recognition not available"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    if (isListening) {
      return // Already listening
    }

    try {
      setError(null)
      retryCountRef.current = 0
      recognitionRef.current.start()
    } catch (err: any) {
      const errorMsg = `Failed to start speech recognition: ${err.message}`
      setError(errorMsg)
      onError?.(errorMsg)
      console.error("Failed to start recognition:", err)
    }
  }, [isListening, isSupported, onError])

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error("Failed to stop recognition:", err)
      }
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    browserSupportsSpeechRecognition: isSupported,
  }
}

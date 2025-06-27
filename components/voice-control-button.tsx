"use client"

import { Mic, MicOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VoiceControlButtonProps {
  isListening: boolean
  onClick: () => void
  error?: string | null
  disabled?: boolean
}

export function VoiceControlButton({
  isListening,
  onClick,
  error,
  disabled = false
}: VoiceControlButtonProps) {
  const hasError = !!error
  const buttonClasses = `w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
    hasError
      ? "bg-orange-500 hover:bg-orange-600"
      : isListening
      ? "bg-red-600 hover:bg-red-700 scale-110 animate-pulse"
      : "bg-emerald-600 hover:bg-emerald-700"
  }`

  const getIcon = () => {
    if (hasError) return <AlertCircle size={32} />
    return isListening ? <MicOff size={32} /> : <Mic size={32} />
  }

  const getTooltipText = () => {
    if (hasError) return `Voice Error: ${error}`
    if (disabled) return "Voice recognition not available"
    return isListening ? "Stop listening" : "Start voice recognition"
  }

  const getAriaLabel = () => {
    if (hasError) return "Voice recognition error"
    if (disabled) return "Voice recognition disabled"
    return isListening ? "Stop listening" : "Start listening"
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-8 right-8 z-[101]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={onClick}
              disabled={disabled}
              className={buttonClasses}
              aria-label={getAriaLabel()}
            >
              {getIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p>{getTooltipText()}</p>
            {!hasError && !disabled && (
              <p className="text-xs opacity-75 mt-1">
                {isListening
                  ? "Listening for voice commands..."
                  : "Click to start voice recognition"
                }
              </p>
            )}
          </TooltipContent>
        </Tooltip>

        {/* Visual indicator for listening state */}
        {isListening && !hasError && (
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
        )}

        {/* Error indicator */}
        {hasError && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

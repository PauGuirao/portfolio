'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, User, Bot, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Pau's AI assistant. Feel free to ask me anything about his experience, skills, or projects! 👋",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  // Show the prompt after a delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  // Hide prompt when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowPrompt(false)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Simulate bot response (placeholder for future AI integration)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! This is where I would respond with information about Pau. The AI integration is coming soon! 🚀",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Icon - Fixed bottom right */}
      <div className="fixed bottom-14 right-3 z-50">
        {/* Hire me prompt */}
        <div
          className={cn(
            "absolute bottom-0 right-10 mb-1 transform transition-all duration-500 ease-in-out",
            showPrompt && !isOpen 
              ? "translate-y-0 opacity-100 scale-100" 
              : "translate-y-2 opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="relative">
            <div className="px-3 py-2 whitespace-nowrap">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                Should you hire me? Ask!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl",
            isOpen && "opacity-0 pointer-events-none"
          )}
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Panel - Sliding from right */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-96 transform transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen 
            ? "translate-x-0" 
            : "translate-x-full"
        )}
      >
        {/* Chat Container */}
        <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">Ask about Pau</h3>
                <p className="text-xs text-blue-100">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-blue-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                    P
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === 'user'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  )}
                >
                  {message.content}
                </div>
                {message.sender === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Pau's experience..."
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Ask me anything about Pau's background and experience.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
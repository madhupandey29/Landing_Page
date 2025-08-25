"use client"

import { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, MessageCircle, Phone, Mail, Globe, RefreshCcw } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'quick-reply'
}

interface QuickReply {
  id: string
  text: string
  action: string
}

interface N8nResponse {
  success: boolean
  message: string
  data?: any
}



export function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAtProducts, setIsAtProducts] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to FabricPro. I\'m here to help you with your fabric requirements. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

 
  // n8n Webhook Configuration
  //const N8N_WEBHOOK_URL = 'https://n8n.egport.com/webhook/92b9c54d-a413-4e49-8c05-37cfa42e83b0'
  
  //const N8N_WEBHOOK_URL: = process.env.N8N_WEBHOOK_URL;
  
  
  // API Key Configuration - Choose one method:
  // Method 1: Environment variable (recommended)
  //const N8N_API_KEY =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYmU1MjdhYi01NDBhLTQ4OTktOWI2MS00MWVmZGZiNDBiMmUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NjU5NDU3LCJleHAiOjE3NTcxODM0MDB9.u-yDlBG1XH383i_ov3qlI2YVcRL7Sq9PH18z-gnuxPY"
  
  //const N8N_API_KEY =  process.env.N8N_API_KEY
  
  // Method 2: Direct API key (for testing only)
  // const N8N_API_KEY = 'your-api-key-here'
  
  // Method 3: No API key (if webhook is public)
  // const N8N_API_KEY = null

  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY;

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Get Quote', action: 'quote' },
    { id: '2', text: 'Product Catalog', action: 'catalog' },
    { id: '3', text: 'Shipping Info', action: 'shipping' },
    { id: '4', text: 'Contact Sales', action: 'contact' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Track whether the user is viewing the product section
  useEffect(() => {
    if (typeof window === 'undefined') return
    const section = document.getElementById('products')
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsAtProducts(entry.isIntersecting && entry.intersectionRatio > 0.2)
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Function to send message to n8n webhook
  const sendToN8n = async (userMessage: string): Promise<N8nResponse> => {
    try {
      setIsLoading(true)
      if (!N8N_WEBHOOK_URL) {
        console.warn("NEXT_PUBLIC_N8N_WEBHOOK_URL is not set. Returning fallback response.")
        return {
          success: true,
          message: "Thanks for your message! Our assistant will be configured soon.",
          data: null,
        }
      }
      
      // Prepare headers with optional API key
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Add Authorization header only if API key is provided
      if (N8N_API_KEY) {
        headers['Authorization'] = `Bearer ${N8N_API_KEY}`
      }
      
      const response = await fetch(N8N_WEBHOOK_URL as string, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString(),
          sessionId: 'user-session-' + Date.now(),
          context: {
            previousMessages: messages.slice(-5).map(msg => ({
              text: msg.text,
              isUser: msg.isUser
            }))
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response has content
      const responseText = await response.text()
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response from n8n')
        return {
          success: true,
          message: 'Thank you for your message! I\'m here to help with your fabric requirements.',
          data: null
        }
      }

      // Try to parse JSON, handle non-JSON responses
      let data
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        console.log('Non-JSON response from n8n:', responseText)
        // Handle plain text response
        return {
          success: true,
          message: responseText || 'Thank you for your message! I\'m here to help with your fabric requirements.',
          data: { rawResponse: responseText }
        }
      }
      
      // Handle different response formats from n8n
      let responseMessage = ''
      
      if (data.response) {
        // Direct response field
        responseMessage = data.response
      } else if (data.message) {
        // Message field
        responseMessage = data.message
      } else if (data.text) {
        // Text field
        responseMessage = data.text
      } else if (data.output) {
        // AI Agent output field
        responseMessage = data.output
      } else if (data.content) {
        // Content field (common in AI responses)
        responseMessage = data.content
      } else if (data.answer) {
        // Answer field
        responseMessage = data.answer
      } else if (data.result) {
        // Result field
        responseMessage = data.result
      } else if (typeof data === 'string') {
        // Direct string response
        responseMessage = data
      } else if (data[0] && data[0].response) {
        // Array format with response
        responseMessage = data[0].response
      } else if (data[0] && data[0].output) {
        // Array format with AI Agent output
        responseMessage = data[0].output
      } else if (data[0] && data[0].text) {
        // Array format with text
        responseMessage = data[0].text
      } else {
        // Fallback - try to find any text content
        const jsonString = JSON.stringify(data)
        if (jsonString.includes('"text"') || jsonString.includes('"response"') || jsonString.includes('"output"')) {
          // Try to extract from nested objects
          const extractText = (obj: any): string => {
            if (typeof obj === 'string') return obj
            if (obj.text) return obj.text
            if (obj.response) return obj.response
            if (obj.output) return obj.output
            if (obj.content) return obj.content
            if (obj.answer) return obj.answer
            if (obj.result) return obj.result
            if (Array.isArray(obj) && obj.length > 0) return extractText(obj[0])
            return 'Thank you for your message! I\'m here to help with your fabric requirements.'
          }
          responseMessage = extractText(data)
        } else {
          responseMessage = 'Thank you for your message! I\'m here to help with your fabric requirements.'
        }
      }

      console.log('n8n Response:', data) // Debug log
      
      return {
        success: true,
        message: responseMessage,
        data: data
      }
    } catch (error) {
      console.error('Error sending message to n8n:', error)
      return {
        success: false,
        message: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        data: null
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = async (action: string) => {
    const quickReplyText = quickReplies.find(qr => qr.action === action)?.text || ''
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: quickReplyText,
      isUser: true,
      timestamp: new Date(),
      type: 'quick-reply'
    }

    setMessages(prev => [...prev, userMessage])
    setShowQuickReplies(false)
    setIsTyping(true)

    // Send to n8n with action context
    const n8nResponse = await sendToN8n(`Action: ${action} - ${quickReplyText}`)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: n8nResponse.message,
      isUser: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setShowQuickReplies(false)

    // Send message to n8n webhook
    const n8nResponse = await sendToN8n(inputMessage)
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: n8nResponse.message,
      isUser: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: 'Hello! 👋 Welcome to FabricPro. I\'m here to help you with your fabric requirements. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }])
    setShowQuickReplies(true)
  }

  const containerPosition = isAtProducts
    ? "right-4 top-4 md:right-6 md:top-14"
    : "right-4 top-1/2 -translate-y-1/2 md:right-6 md:top-1/2"

  return (
    <div className={`fixed z-50 ${containerPosition}`}>
      {/* Animated Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 animate-bounce ${
          isChatOpen 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white' 
            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white'
        }`}
        style={{
          animation: isChatOpen ? 'none' : 'rainbow 3s ease-in-out infinite',
          boxShadow: isChatOpen 
            ? '0 8px 32px rgba(239, 68, 68, 0.4)' 
            : '0 8px 32px rgba(59, 130, 246, 0.4)'
        }}
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-300"></div>
        
        {/* Animated background rings */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Icon */}
        <div className="relative z-10">
          {isChatOpen ? (
            <X className="w-7 h-7 animate-pulse" />
          ) : (
            <Bot className="w-7 h-7 animate-bounce" />
          )}
        </div>

        {/* Notification dot */}
        {!isChatOpen && (
          <>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className={
            `absolute w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-slide-in ` +
            (isAtProducts ? 'right-0 top-16' : 'right-0 top-1/3 transform -translate-y-1/2')
          }
        >
          {/* Close Button */}
          {/* Close and Reset Buttons Side by Side */}
          <div className="absolute top-3 right-3 z-20 flex items-center space-x-2">
            <button
              aria-label="Reset chat"
              onClick={resetChat}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              type="button"
            >
              {/* Refresh Icon */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M19.418 19A9 9 0 106 6.582" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4v5h-5" />
              </svg>
            </button>
            <button
              aria-label="Close chat"
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              type="button"
            >
              {/* Close Icon */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">FabricPro Assistant</h3>
                  <p className="text-xs text-blue-100">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="text-blue-100 hover:text-white transition-colors"
                title="Refresh chat"
                aria-label="Refresh chat"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Quick options:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.action)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes rainbow {
          0%, 100% {
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          }
          25% {
            background: linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6);
          }
          50% {
            background: linear-gradient(45deg, #ec4899, #3b82f6, #8b5cf6);
          }
          75% {
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes slide-in {
          0% {
            transform: translateX(20px) translateY(-50%);
            opacity: 0;
          }
          100% {
            transform: translateX(0px) translateY(-50%);
            opacity: 1;
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .animate-bounce {
            animation: bounce 1.5s infinite;
          }
        }
      `}</style>
    </div>
  )
}

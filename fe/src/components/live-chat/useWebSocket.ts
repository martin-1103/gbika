// useWebSocket: Custom hook for managing WebSocket connection and chat functionality

import { useState, useRef, useCallback } from 'react'
import { ChatMessage, UserData, ChatState, SessionData, WebSocketMessage } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'

export const useWebSocket = () => {
  const [chatState, setChatState] = useState<ChatState>({
    status: 'disconnected',
    onlineCount: 0,
    isSubmitting: false,
    error: null,
    rateLimitError: null,
    retryAfter: null
  })
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [approvedMessages, setApprovedMessages] = useState<ChatMessage[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const sessionDataRef = useRef<SessionData | null>(null)

  // Load session data from localStorage
  const loadSessionData = useCallback((): SessionData | null => {
    try {
      const sessionToken = localStorage.getItem('sessionToken')
      const sessionId = localStorage.getItem('sessionId')
      const userData = localStorage.getItem('userData')
      const expiresAt = localStorage.getItem('sessionExpiresAt')

      if (sessionToken && sessionId && userData && expiresAt) {
        const parsedUserData = JSON.parse(userData)
        const expirationTime = new Date(expiresAt)
        
        if (expirationTime > new Date()) {
          return {
            sessionToken,
            sessionId,
            userData: parsedUserData,
            expiresAt: expirationTime
          }
        }
      }
    } catch (error) {
      console.error('Error loading session data:', error)
    }
    return null
  }, [])

  // Save session data to localStorage
  const saveSessionData = useCallback((sessionData: SessionData) => {
    try {
      localStorage.setItem('sessionToken', sessionData.sessionToken)
      localStorage.setItem('sessionId', sessionData.sessionId)
      localStorage.setItem('userData', JSON.stringify(sessionData.userData))
      localStorage.setItem('sessionExpiresAt', sessionData.expiresAt.toISOString())
      sessionDataRef.current = sessionData
    } catch (error) {
      console.error('Error saving session data:', error)
    }
  }, [])

  // Create new session
  const createSession = useCallback(async (userData: UserData): Promise<SessionData> => {
    const response = await fetch(`${API_BASE_URL}/livechat/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create session')
    }

    const apiResponse = await response.json()
    console.log('Create session response:', apiResponse)
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Invalid session response')
    }
    
    return {
      sessionToken: apiResponse.data.sessionToken,
      sessionId: apiResponse.data.sessionId,
      userData,
      expiresAt: new Date(apiResponse.data.expiresAt)
    }
  }, [])

  // Fetch approved messages history
  const fetchApprovedMessages = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/livechat/messages/approved`)
      if (response.ok) {
        const apiResponse = await response.json()
        console.log('Approved messages response:', apiResponse)
        
        // Handle API response format: { success: true, data: { messages: [...] } }
        if (apiResponse.success && apiResponse.data && Array.isArray(apiResponse.data.messages)) {
          const formattedMessages: ChatMessage[] = apiResponse.data.messages.map((msg: {
            id: string;
            text?: string;
            message?: string;
            senderName?: string;
            createdAt?: string;
            created_at?: string;
            session?: {
              guestUser?: {
                name?: string;
                city?: string;
              }
            }
          }) => ({
            id: msg.id,
            name: msg.session?.guestUser?.name || msg.senderName || 'Anonymous',
            city: msg.session?.guestUser?.city || 'Unknown',
            message: msg.text || msg.message || '',
            timestamp: new Date(msg.createdAt || msg.created_at || Date.now()),
            status: 'delivered' as const
          }))
          setApprovedMessages(formattedMessages)
        } else if (Array.isArray(apiResponse)) {
          // Fallback: handle direct array response
          const formattedMessages: ChatMessage[] = apiResponse.map((msg: {
            id: string;
            text?: string;
            message?: string;
            name?: string;
            city?: string;
            senderName?: string;
            createdAt?: string;
            created_at?: string;
            session?: {
              guestUser?: {
                name?: string;
                city?: string;
              }
            }
          }) => ({
            id: msg.id,
            name: msg.session?.guestUser?.name || msg.senderName || msg.name || 'Anonymous',
            city: msg.session?.guestUser?.city || msg.city || 'Unknown',
            message: msg.text || msg.message || '',
            timestamp: new Date(msg.createdAt || msg.created_at || Date.now()),
            status: 'delivered' as const
          }))
          setApprovedMessages(formattedMessages)
        } else {
          console.log('No approved messages found or invalid format')
          setApprovedMessages([])
        }
      } else {
        console.error('Failed to fetch approved messages:', response.status)
        setApprovedMessages([])
      }
    } catch (error) {
      console.error('Error fetching approved messages:', error)
      setApprovedMessages([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  // Connect to WebSocket
  const connectWebSocket = useCallback(async (userData?: UserData) => {
    setChatState(prev => ({ ...prev, status: 'connecting', error: null }))

    try {
      // Load existing session or create new one
      let sessionData = loadSessionData()
      
      if (!sessionData && userData) {
        sessionData = await createSession(userData)
        saveSessionData(sessionData)
      }

      if (!sessionData) {
        throw new Error('No valid session data available')
      }

      // Fetch approved messages history
      await fetchApprovedMessages()

      // Create WebSocket connection
      const ws = new WebSocket(`${WS_URL}?token=${sessionData.sessionToken}`)
      wsRef.current = ws

      ws.onopen = () => {
        setChatState(prev => ({ ...prev, status: 'connected', error: null }))
      }

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          
          switch (data.type) {
            case 'message':
              const newMessage: ChatMessage = {
                id: data.id || Date.now().toString(),
                name: data.name || '',
                city: data.city || '',
                message: data.message || '',
                timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                status: 'delivered'
              }
              setMessages(prev => [...prev, newMessage])
              break
              
            case 'online_count':
              setChatState(prev => ({ ...prev, onlineCount: data.count || 0 }))
              break
              
            case 'rate_limit':
              setChatState(prev => ({
                ...prev,
                rateLimitError: data.message || 'Rate limit exceeded',
                retryAfter: data.retryAfter || null
              }))
              break
              
            case 'error':
              setChatState(prev => ({ ...prev, error: data.message || 'Unknown error' }))
              break
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setChatState(prev => ({ ...prev, error: 'Connection error occurred' }))
      }

      ws.onclose = () => {
        setChatState(prev => ({ ...prev, status: 'disconnected' }))
        wsRef.current = null
      }

    } catch (error) {
      console.error('Connection error:', error)
      setChatState(prev => ({
        ...prev,
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Failed to connect'
      }))
    }
  }, [loadSessionData, saveSessionData, createSession, fetchApprovedMessages])


  // Send message
  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setChatState(prev => ({ ...prev, error: 'Not connected to server' }))
      return
    }

    if (!sessionDataRef.current) {
      setChatState(prev => ({ ...prev, error: 'No session data available' }))
      return
    }

    setChatState(prev => ({ ...prev, isSubmitting: true, rateLimitError: null }))

    try {
      const messageData = {
        type: 'message',
        message: message.trim(),
        name: sessionDataRef.current!.userData.name,
        city: sessionDataRef.current!.userData.city,
        timestamp: new Date().toISOString()
      }

      wsRef.current.send(JSON.stringify(messageData))

      // Add message to local state with 'sent' status
      const localMessage: ChatMessage = {
        id: Date.now().toString(),
        name: sessionDataRef.current.userData.name,
        city: sessionDataRef.current.userData.city,
        message: message.trim(),
        timestamp: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, localMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      setChatState(prev => ({ ...prev, error: 'Failed to send message' }))
    } finally {
      setChatState(prev => ({ ...prev, isSubmitting: false }))
    }
  }, [])

  // Close connection
  const closeConnection = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setChatState({
      status: 'disconnected',
      onlineCount: 0,
      isSubmitting: false,
      error: null,
      rateLimitError: null,
      retryAfter: null
    })
  }, [])

  return {
    chatState,
    messages,
    approvedMessages,
    historyLoading,
    connectWebSocket,
    sendMessage,
    closeConnection
  }
}
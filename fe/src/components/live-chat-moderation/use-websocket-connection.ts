import { useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { WebSocketMessage, ModerationState } from './types'

interface UseWebSocketConnectionProps {
  state: ModerationState
  setState: React.Dispatch<React.SetStateAction<ModerationState>>
  handleWebSocketMessage: (data: WebSocketMessage) => void
}

export function useWebSocketConnection({ 
  state, 
  setState, 
  handleWebSocketMessage 
}: UseWebSocketConnectionProps) {
  const { isAuthenticated, token, user } = useAuthStore()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectingRef = useRef<boolean>(false)

  const connectWebSocket = useCallback(() => {
    try {
      if (!isAuthenticated || !token) {
        setState(prev => ({ 
          ...prev, 
          wsStatus: 'disconnected',
          error: 'Tidak terautentikasi. Silakan login terlebih dahulu.'
        }))
        return
      }

      if (!user || (user.role !== 'admin' && user.role !== 'penyiar')) {
        setState(prev => ({ 
          ...prev, 
          wsStatus: 'disconnected',
          error: 'Akses ditolak. Hanya admin yang dapat mengakses moderasi chat.'
        }))
        return
      }

      if (isConnectingRef.current || state.wsStatus === 'connecting') {
        console.log('WebSocket connection already in progress, skipping...')
        return
      }

      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        console.log('Closing existing WebSocket connection...')
        wsRef.current.close()
        wsRef.current = null
      }

      isConnectingRef.current = true
      setState(prev => ({ ...prev, wsStatus: 'connecting', error: null }))
      
      const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
      const wsUrl = `${wsBaseUrl}/livechat/ws?token=${encodeURIComponent(token)}&role=moderator`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected for moderation')
        isConnectingRef.current = false
        setState(prev => ({ ...prev, wsStatus: 'connected', isLoading: false, error: null }))
        wsRef.current?.send(JSON.stringify({ 
          type: 'get_messages', 
          status: 'all' 
        }))
      }

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('Received WebSocket message:', data)
        
        if (data.event) {
          switch (data.event) {
            case 'new_message':
              handleWebSocketMessage({
                type: 'new_message',
                message: data.payload
              })
              break
            case 'connection:success':
              console.log('WebSocket connection established:', data.payload)
              break
            default:
              console.log('Unknown event type:', data.event)
          }
        } else {
          handleWebSocketMessage(data)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        isConnectingRef.current = false
        setState(prev => ({ ...prev, wsStatus: 'disconnected' }))
        wsRef.current = null
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        isConnectingRef.current = false
        setState(prev => ({ 
          ...prev, 
          wsStatus: 'disconnected',
          error: 'Koneksi WebSocket gagal'
        }))
        if (wsRef.current) {
          wsRef.current.close()
          wsRef.current = null
        }
      }
    } catch {
      isConnectingRef.current = false
      setState(prev => ({ 
        ...prev, 
        wsStatus: 'disconnected',
        error: 'Gagal menghubungkan ke server'
      }))
    }
  }, [isAuthenticated, token, user, state.wsStatus, setState, handleWebSocketMessage])

  const closeWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const shouldAutoReconnect = useCallback(() => {
    return state.wsStatus === 'disconnected' && 
           isAuthenticated && 
           token && 
           user && 
           (user.role === 'admin' || user.role === 'penyiar') &&
           !state.error?.includes('Tidak terautentikasi') &&
           !state.error?.includes('Akses ditolak') &&
           !isConnectingRef.current
  }, [state.wsStatus, state.error, isAuthenticated, token, user])

  const scheduleReconnect = useCallback(() => {
    if (shouldAutoReconnect()) {
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Auto-reconnecting WebSocket...')
        connectWebSocket()
      }, 5000)
    }
  }, [shouldAutoReconnect, connectWebSocket])

  return {
    wsRef,
    reconnectTimeoutRef,
    isConnectingRef,
    connectWebSocket,
    closeWebSocket,
    scheduleReconnect,
    shouldAutoReconnect
  }
}
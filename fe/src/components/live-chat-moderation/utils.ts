import { ChatMessage, ModerationStats } from './types'

export const groupMessagesByStatus = (messages: ChatMessage[]) => {
  return {
    pending: messages.filter(m => m.status === 'pending'),
    approved: messages.filter(m => m.status === 'approved'),
    rejected: messages.filter(m => m.status === 'rejected' || m.status === 'blocked')
  }
}

export const calculateStats = (messages: ChatMessage[]): ModerationStats => {
  return {
    pending: messages.filter(m => m.status === 'pending').length,
    approved: messages.filter(m => m.status === 'approved').length,
    rejected: messages.filter(m => m.status === 'rejected' || m.status === 'blocked').length,
    total: messages.length
  }
}

export const filterMessages = (messages: ChatMessage[], searchQuery: string) => {
  if (!searchQuery) return messages
  
  const query = searchQuery.toLowerCase()
  return messages.filter(msg => 
    msg.text.toLowerCase().includes(query) ||
    msg.guestName.toLowerCase().includes(query) ||
    msg.guestCity?.toLowerCase().includes(query)
  )
}

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'approved': return 'default'
    case 'rejected': 
    case 'blocked': return 'destructive'
    default: return 'secondary'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Menunggu'
    case 'approved': return 'Disetujui'
    case 'rejected': return 'Ditolak'
    case 'blocked': return 'Diblokir'
    default: return status
  }
}


// MessageInput: Component for message input and sending functionality

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { ChatState } from './types'

interface MessageInputProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  chatState: ChatState
}

export const MessageInput = ({ 
  message, 
  setMessage, 
  onSubmit, 
  onKeyDown, 
  chatState 
}: MessageInputProps) => {
  const isDisabled = chatState.status !== 'connected' || chatState.isSubmitting
  const characterCount = message.trim().length
  const minCharacters = 50
  const isValidLength = characterCount >= minCharacters

  return (
    <div className="p-4 border-t">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={chatState.status === 'connected' 
              ? "Ketik pesan Anda di sini (minimal 50 karakter)..." 
              : "Menunggu koneksi..."}
            className="min-h-[80px] pr-12 resize-none"
            disabled={isDisabled}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {characterCount}/{minCharacters}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {!isValidLength && characterCount > 0 && (
              <span className="text-orange-600">
                Pesan harus minimal {minCharacters} karakter
              </span>
            )}
            {chatState.status !== 'connected' && (
              <span className="text-red-600">
                Tidak terhubung ke server
              </span>
            )}
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={isDisabled || !message.trim() || !isValidLength}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {chatState.isSubmitting ? 'Mengirim...' : 'Kirim'}
          </Button>
        </div>
      </form>
    </div>
  )
}
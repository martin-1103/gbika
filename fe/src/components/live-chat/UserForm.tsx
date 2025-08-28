// UserForm: Form component for user data input (name and city)

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserData, ChatState } from './types'

interface UserFormProps {
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  onSubmit: (e: React.FormEvent) => void
  chatState: ChatState
}

export const UserForm = ({ userData, setUserData, onSubmit, chatState }: UserFormProps) => {
  return (
    <div className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Nama Lengkap *
          </label>
          <Input
            value={userData.name}
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Masukkan nama lengkap Anda"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Kota *
          </label>
          <Input
            value={userData.city}
            onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Masukkan kota Anda"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={chatState.status === 'connecting'}
        >
          {chatState.status === 'connecting' ? 'Menghubungkan...' : 'Mulai Chat'}
        </Button>
      </form>
    </div>
  )
}
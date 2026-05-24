'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Camera, Loader2, Mail, Calendar, Edit2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfileEditorClient({ user, joinedDate }: { user: any, joinedDate: string }) {
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  
  const meta = user?.user_metadata || {}
  const [name, setName] = useState(meta.name || user?.email?.split('@')[0])
  const [isEditingName, setIsEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  
  const avatarUrl = meta.avatar_url
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(fileName, file)
        
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('meal-images')
        .getPublicUrl(fileName)
        
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })
      
      if (updateError) throw updateError
      
      toast.success('Profile image updated!')
      router.refresh()
    } catch (err: any) {
      toast.error('Failed to update image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveName = async () => {
    try {
      setSavingName(true)
      const { error } = await supabase.auth.updateUser({
        data: { name: name }
      })
      if (error) throw error
      
      toast.success('Name updated successfully!')
      setIsEditingName(false)
      router.refresh()
    } catch (err: any) {
      toast.error('Failed to update name: ' + err.message)
    } finally {
      setSavingName(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center text-center relative">
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-purple-500/20 border-4 border-white overflow-hidden">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            name.substring(0, 2).toUpperCase()
          )}
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-10 h-10 bg-[#1a1a1a] hover:bg-[#8b5cf6] text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="mb-1 w-full flex flex-col items-center justify-center min-h-[40px]">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-bold text-[#1a1a1a] text-center border-b-2 border-[#8b5cf6] focus:outline-none bg-transparent w-48"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <button onClick={handleSaveName} disabled={savingName} className="text-green-500 hover:text-green-600">
              {savingName ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            </button>
            <button onClick={() => { setIsEditingName(false); setName(meta.name || user?.email?.split('@')[0]); }} disabled={savingName} className="text-gray-400 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">{name}</h2>
            <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#8b5cf6] transition-opacity">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-500 mb-6 flex items-center justify-center gap-2">
        <Mail className="w-4 h-4" /> {user?.email}
      </p>
      
      <div className="w-full bg-[#f8f9fa] rounded-2xl p-4 flex items-center justify-between border border-gray-100">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <Calendar className="w-5 h-5 text-gray-400" /> Joined
        </div>
        <span className="font-bold text-[#1a1a1a]">{joinedDate}</span>
      </div>
    </div>
  )
}

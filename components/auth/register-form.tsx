'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from './auth-provider'

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!avatar) {
      toast({
        title: 'Error',
        description: 'Avatar is required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const data = new FormData()
      data.append('username', formData.username)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('fullName', formData.fullName)
      data.append('avatar', avatar)
      if (coverImage) data.append('coverImage', coverImage)

      await register(data)
      
      router.push('/login')
      toast({
        title: 'Success',
        description: 'Account created! Please log in.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input name="fullName" placeholder="John Doe" required disabled={isLoading} value={formData.fullName} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input name="username" placeholder="johndoe" required disabled={isLoading} value={formData.username} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" placeholder="john@example.com" required disabled={isLoading} value={formData.email} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" required disabled={isLoading} value={formData.password} onChange={handleInputChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar Image</Label>
        <Input id="avatar" type="file" accept="image/*" required disabled={isLoading} onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image (Optional)</Label>
        <Input id="coverImage" type="file" accept="image/*" disabled={isLoading} onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
      </div>
      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  )
}

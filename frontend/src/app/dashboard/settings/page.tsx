'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // API call would go here
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-dark-400">Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>
          <div className="space-y-4">
            <Input
              label="Username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled
            />
            <Button variant="primary" onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-dark-400 text-sm">Receive email when processing completes</p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 bg-dark-800 border-dark-700 rounded text-pause-600 focus:ring-pause-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-delete Failed Videos</p>
                <p className="text-dark-400 text-sm">Automatically delete videos that fail processing</p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 bg-dark-800 border-dark-700 rounded text-pause-600 focus:ring-pause-500"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-500/20">
          <h2 className="text-xl font-semibold text-red-500 mb-6">Danger Zone</h2>
          <div className="space-y-4">
            <Button variant="ghost" className="text-red-500 hover:text-red-400">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

import { useState, useEffect } from 'react'

export interface UserSettings {
  deductMPF: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
  deductMPF: true
}

export const useUserSettings = (userId: string | null) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    // Just set default settings, no Firestore loading
    setSettings(DEFAULT_SETTINGS)
  }, [userId])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    // Simple local state update, no Firestore saving
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
  }

  return { settings, updateSettings }
}

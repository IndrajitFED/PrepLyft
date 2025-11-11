import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeMode
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'mockace-theme'

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => getPreferredTheme())

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)

    const classListTargets = [document.documentElement, document.body]
    classListTargets.forEach(target => {
      target.classList.remove('light-theme', 'dark-theme')
      target.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme')
    })
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored !== 'light' && stored !== 'dark') {
        setThemeState(event.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}


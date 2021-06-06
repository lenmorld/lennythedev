import React from 'react'

import { getInitialTheme, persistTheme } from '../theming/helper'

export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(getInitialTheme)

  const isDark = theme === 'dark'

  const setThemeAndPersist = (value) => {
    setTheme(value)
    persistTheme(value)
  }

  const toggleTheme = () => {
    console.log(theme)
    if (theme === 'dark') {
      setThemeAndPersist('light')
    } else if (theme === 'light') {
      setThemeAndPersist('dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

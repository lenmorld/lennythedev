import React, { useState, useEffect } from 'react'

import { getInitialTheme, persistTheme } from '../theming/helper'

import COLORS from '../theming/colors'

export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, rawSetTheme] = useState(undefined)

  useEffect(() => {
    const root = window.document.documentElement

    const initialTheme = root.style.getPropertyValue('--initial-theme')

    rawSetTheme(initialTheme)
  }, [])

  const setTheme = (newValue) => {
    const root = window.document.documentElement

    // update state
    rawSetTheme(newValue)
    // persist to localStorage
    persistTheme(newValue)
    // update styles
    root.style.setProperty(
      '--color-text',
      newValue === 'light' ? COLORS.light.text : COLORS.dark.text,
    )

    root.style.setProperty(
      '--color-background',
      newValue === 'light' ? COLORS.light.background : COLORS.dark.background,
    )

    root.style.setProperty(
      '--color-primary',
      newValue === 'light' ? COLORS.light.primary : COLORS.dark.primary,
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

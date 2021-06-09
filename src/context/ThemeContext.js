import React, { useState, useEffect } from 'react'

import { persistTheme, setCssVarColors } from '../theming/helper'

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
    setCssVarColors(root, newValue, COLORS)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

import React, { useContext } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

import { ThemeContext } from '../context/ThemeContext'
import { DARK, LIGHT } from '../theming/constants'

const styles = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  color: '#ffdf00',
  fontSize: '1rem',
  marginTop: '5px',
}

export default function ThemeSwitch() {
  // useContext simplifies context usage, no need to wrap element with render prop
  const themeState = useContext(ThemeContext)

  // don't render switch on first compile-time pass
  if (!themeState) {
    return null
  }

  const { theme, setTheme } = themeState

  const toggleTheme = () => {
    if (theme === LIGHT) {
      setTheme(DARK)
    } else {
      setTheme(LIGHT)
    }
  }

  return (
    <button
      style={styles}
      className="theme-switch"
      type="button"
      onClick={toggleTheme}
    >
      {theme === DARK ? <FaMoon /> : <FaSun />}
    </button>
  )
}

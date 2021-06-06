import React from 'react'

import { ThemeContext } from '../context/ThemeContext'

const ThemeSwitch = () => {
  // console.log('themeSwitch theme: ', theme)
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <button
          className="theme-switch"
          type="button"
          onClick={theme.toggleTheme}
        >
          {theme.isDark ? <span>☀️</span> : <span>🌙</span>}
        </button>
      )}
    </ThemeContext.Consumer>
  )
}

export default ThemeSwitch

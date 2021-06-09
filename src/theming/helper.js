import { THEME } from './constants'

export const setCssVarColors = (htmlRootElement, currentTheme, colors) => {
  /* {
    light: { text: 'black', background: 'white', ...}
    dark: { text: 'white', background: 'black', ...}
  } */
  Object.entries(colors[currentTheme]).forEach(([cssProp, cssValue]) => {
    htmlRootElement.style.setProperty(`--color-${cssProp}`, cssValue)
  })
}

// --- moved to gatsby-ssr.js ---
// export const getInitialTheme = () => {...}

export const persistTheme = (theme) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME, theme)
  }
}

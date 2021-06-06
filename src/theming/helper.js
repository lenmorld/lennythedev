import { THEME } from './constants'

// --- moved to gatsby-ssr.js ---
// export const getInitialTheme = () => {...}

export const persistTheme = (theme) => {
  typeof window !== 'undefined' && window.localStorage.setItem(THEME, theme)
}

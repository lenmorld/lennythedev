import { THEME, DARK, LIGHT } from './constants'

export const getInitialTheme = () => {
  // check localStorage value, user explicitly chose light/dark
  const persistedColorPref =
    typeof window !== 'undefined' && window.localStorage.getItem(THEME)

  if (persistedColorPref) {
    return persistedColorPref
  }

  // check browser/OS set theme prefers-color-scheme
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  if (typeof mediaQuery.matches === 'boolean') {
    return mediaQuery.matches ? DARK : LIGHT
  }

  // if they are using a browser/OS that doesn't support color themes, default to 'light'
  return LIGHT
}

export const persistTheme = (theme) => {
  typeof window !== 'undefined' && window.localStorage.setItem(THEME, theme)
}

// export const a = 1

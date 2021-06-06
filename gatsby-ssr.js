import React from 'react'

import COLORS from './src/theming/colors'

import { THEME, LIGHT, DARK } from './src/theming/constants'

/*
gatsby-ssr.js is a file which will run when Gatsby is compiling your site (at build time).
*/

const MagicScriptTag = () => {
  const codeToRunOnClient = `
        (function() {
            // alert("Hi!")
            const getInitialTheme = () => {
                // check localStorage value, user explicitly chose light/dark
                const persistedColorPref =
                  typeof window !== 'undefined' && window.localStorage.getItem('${THEME}')

                if (persistedColorPref) {
                  return persistedColorPref
                }

                // check browser/OS set theme prefers-color-scheme
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

                if (typeof mediaQuery.matches === 'boolean') {
                  return mediaQuery.matches ? 'dark' : 'light'
                }

                // if they are using a browser/OS that doesn't support color themes, default to 'light'
                return 'light'
              }

              const currentTheme = getInitialTheme()

              // <html>
              const root = document.documentElement;

              // Object.entries(COLORS[currentTheme]).forEach(([cssProp, cssValue]) => {
              //  root.style.setProperty('--color-' + cssProp, cssValue)
              // })

              root.style.setProperty(
                '--color-text',
                currentTheme === 'light'
                  ? '${COLORS.light.text}'
                  : '${COLORS.dark.text}'
            )

            root.style.setProperty(
              '--color-background',
              currentTheme === 'light'
                ? '${COLORS.light.background}'
                : '${COLORS.dark.background}'
            )

            root.style.setProperty(
              '--color-primary',
              currentTheme === 'light'
                ? '${COLORS.light.primary}'
                : '${COLORS.dark.primary}'
            )

              root.style.setProperty(
                  '--initial-theme', currentTheme
              )
        })()
    `

  console.log(codeToRunOnClient)

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

export const onRenderBody = ({ setPreBodyComponents }) => {
  // inject React element above everything else, within the <body> tags
  setPreBodyComponents(<MagicScriptTag />)
}

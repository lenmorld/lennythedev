// gatsby-ssr.js is a file which will run when Gatsby is compiling your site (at build time).

import React from 'react'

import COLORS from './src/theming/colors'
import { THEME, LIGHT, DARK } from './src/theming/constants'

import { setCssVarColors } from './src/theming/helper'

function setColorsByTheme() {
  // set placeholder tokens to replace after
  // Replace imports because they become stringified to the webpack import name
  // e.g. LIGHT -> Object(_src_theming_constants__WEBPACK_IMPORTED_MODULE_2__["LIGHT"])
  // Later, at String(x) time, replace these tokens back with actual functions, objects, variables
  // e.g. return '🌞' -> return 'light'
  const colors = '🎨' // COLORS
  const theme = '🔲' // THEME
  const light = '🌞' // LIGHT
  const dark = '🌝' // DARK

  // same for function, but we replace in place, since it's called, not assigned
  // see functionPlaceholderSetCssVarColors

  // alert("Hi!")

  const getInitialTheme = () => {
    // check localStorage value, user explicitly chose light/dark
    const persistedColorPref =
      typeof window !== 'undefined' && window.localStorage.getItem(theme)

    if (persistedColorPref) {
      return persistedColorPref
    }

    // check browser/OS set theme prefers-color-scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (typeof mediaQuery.matches === 'boolean') {
      return mediaQuery.matches ? dark : light
    }

    // if they are using a browser/OS that doesn't support color themes, default to 'light'
    return light
  }

  const currentTheme = getInitialTheme()
  const htmlRootElement = document.documentElement // <html>

  // eslint-disable-next-line no-undef
  functionPlaceholderSetCssVarColors(htmlRootElement, currentTheme, colors)

  htmlRootElement.style.setProperty('--initial-theme', currentTheme)
}

const MagicScriptTag = () => {
  // stringify main function and helper too so it's available on the function's scope
  const helpersString = String(setCssVarColors)
  const setColorsByThemeString = String(setColorsByTheme)

  const stringifiedCode = `
        ${helpersString}
        ${setColorsByThemeString}
        
        // call main function
        setColorsByTheme()
    `
  // replace tokens with actual objects
  // We have to do "'🎨'" because the Stringified code has the '', e.g. `var colors = '🎨'`
  // For the COLORS object, we have to JSON.stringify so it won't be [object Object]
  const interpolatedFunctionString = stringifiedCode
    .replace("'🎨'", JSON.stringify(COLORS))
    .replace("'🔲'", `'${THEME}'`)
    .replace("'🌞'", `'${LIGHT}'`)
    .replace("'🌝'", `'${DARK}'`)
    .replace(/functionPlaceholderSetCssVarColors/g, 'setCssVarColors')

  // wrap in IIFE
  const codeToRunOnClient = `(
        function() {
            ${interpolatedFunctionString}
        })()
    `

  // un-comment to verify interpolated string
  //   console.log(codeToRunOnClient)

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

/* eslint-disable import/prefer-default-export */
export const onRenderBody = ({ setPreBodyComponents }) => {
  // inject React element above everything else, within the <body> tags
  setPreBodyComponents(<MagicScriptTag />)
}

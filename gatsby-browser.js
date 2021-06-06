import React from 'react'

import './src/styles/global.css'

import 'prismjs/themes/prism-okaidia.css'
// import "prismjs/themes/prism.css"
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import 'prismjs/plugins/command-line/prism-command-line.css'

// override prismjs styles
import './src/styles/codes.css'

import { ThemeProvider } from './src/context/ThemeContext'

/*
  wrap entire app in Provider
    wrapRootElement for providers
    wrapPageElement for layouts
*/
export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)

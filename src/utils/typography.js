import Typography from "typography"
import irving from "typography-theme-irving"
// irving.baseFontSize = '22px' // was 20px.
// irving.bodyFontFamily = ['Exo', 'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'] // was 20px.
const typography = new Typography(irving)
// const typography = new Typography({
// 	baseFontSize: '18px',
// 	baseLineHeight: 1.666,
// 	headerFontFamily: ['Exo', 'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
// 	bodyFontFamily: ['Exo', 'Georgia', 'serif'],
// 	// See below for the full list of options.
//  })
export const { scale, rhythm, options } = typography
export default typography
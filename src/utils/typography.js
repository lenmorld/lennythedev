import Typography from "typography"
// import theme from "typography-theme-irving"
import theme from 'typography-theme-fairy-gates'

theme.overrideThemeStyles = () => ({
    body: {
        // fontFamily: "'Exo', Arial, Helvetica, 'sans-serif'"
    },
    a: {
          textDecoration: "none",
          color: "#1d048d",
          backgroundImage: "none",
          fontWeight: 700
    },

    "a:hover": {
        color: "#1ca086"
    }
  });

const typography = new Typography(theme)

export const { scale, rhythm, options } = typography
export default typography
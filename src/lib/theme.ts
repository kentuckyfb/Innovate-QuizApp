// src/lib/theme.ts
export const theme = {
  colors: {
    primary: {
      light: 'rgb(174, 0, 116)', // light purple
      main: 'rgb(174, 0, 116)', // main purple
      dark: 'rgb(174, 0, 116)', // dark purple
      contrastText: 'rgb(255, 255, 255)', // white
    },
    secondary: {
      light: 'rgb(255, 235, 59)', // light yellow
      main: 'rgb(251, 192, 45)', // main yellow
      dark: 'rgb(196, 144, 0)', // dark yellow
      contrastText: 'rgb(0, 0, 0)', // black
    },
    background: {
      light: 'rgb(245, 240, 255)', // very light purple (almost white)
      main: 'rgb(156, 39, 176)', // matching the light purple for consistency
      dark: 'rgb(230, 217, 255)', // light purple background
    },
    text: {
      primary: 'rgb(174, 0, 116)', // dark purple
      secondary: 'rgb(106, 0, 128)', // main purple
      light: 'rgb(255, 255, 255)', // white
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
};

export default theme;

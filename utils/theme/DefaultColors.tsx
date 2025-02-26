import { createTheme } from "@mui/material/styles";
import { Plus_Jakarta_Sans } from "next/font/google";

export const plus = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#0077B6",
      light: "#E6F3F8",
      dark: "#005A8C",
    },
    secondary: {
      main: "#FF6B6B",
      light: "#FFE5E5",
      dark: "#CC5555",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#e8f5e9",
      dark: "#2e7d32",
      contrastText: "#ffffff",
    },
    info: {
      main: "#2196f3",
      light: "#e3f2fd",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#ffebee",
      dark: "#c62828",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#fff3e0",
      dark: "#ef6c00",
      contrastText: "#212326",
    },
    grey: {
      100: "#fafafa",
      200: "#e4e5e7",
      300: "#ced0d4",
      400: "#9da1aa",
      500: "#6d737e",
      600: "#212326",
    },
    text: {
      primary: "#212326",
      secondary: "#6d737e",
    },
    action: {
      disabledBackground: "rgba(33,35,38,0.12)",
      hoverOpacity: 0.02,
      hover: "#fafafa",
    },
    divider: "#e4e5e7",
  },
  typography: {
    fontFamily: plus.style.fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      fontFamily: plus.style.fontFamily,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
      fontFamily: plus.style.fontFamily,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3125rem",
      lineHeight: "1.6rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: "1.6rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.2rem",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334rem",
    },
    body2: {
      fontSize: "0.75rem",
      letterSpacing: "0rem",
      fontWeight: 400,
      lineHeight: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
        },
      },
    },
  },
});

export { baselightTheme };

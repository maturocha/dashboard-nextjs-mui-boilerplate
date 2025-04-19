"use client"

import type React from "react"

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useMemo, createContext, useState, useContext } from "react"
import type { PaletteMode } from "@mui/material"

type ThemeContextType = {
  mode: PaletteMode
  toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
})

export const useTheme = () => useContext(ThemeContext)


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light")

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
      },
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#008f01",
            light: "#33b734", // Lighter version of #008f01
            dark: "#006801", // Darker version of #008f01
          },
          secondary: {
            main: "#d15e11",
            light: "#e17e3d", // Lighter version of #d15e11
            dark: "#9c460d", // Darker version of #d15e11
          },
          background: {
            default: mode === "light" ? "#f9fafb" : "#0a0a14",
            paper: mode === "light" ? "#ffffff" : "#111122",
          },
          error: {
            main: "#ef4444",
          },
          warning: {
            main: "#f59e0b",
          },
          info: {
            main: "#3b82f6",
          },
          success: {
            main: "#10b981",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === "light" ? "0px 2px 4px rgba(0, 0, 0, 0.05)" : "0px 2px 4px rgba(0, 0, 0, 0.2)",
                border: mode === "light" ? "1px solid rgba(0, 0, 0, 0.05)" : "1px solid rgba(255, 255, 255, 0.05)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom:
                  mode === "light" ? "1px solid rgba(0, 0, 0, 0.05)" : "1px solid rgba(255, 255, 255, 0.05)",
              },
              head: {
                fontWeight: 600,
                backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)",
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover": {
                  backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.01)" : "rgba(255, 255, 255, 0.01)",
                },
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                border: mode === "light" ? "1px solid rgba(0, 0, 0, 0.05)" : "1px solid rgba(255, 255, 255, 0.05)",
              },
            },
          },
        },
      }),
    [mode],
  )

  return (
    <ThemeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

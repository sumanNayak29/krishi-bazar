"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1aa35a", // brand-primary (emerald)
      light: "#22c55e",
      dark: "#15803d",
    },
    secondary: {
      main: "#d97706", // brand-secondary (amber)
      light: "#f59e0b",
      dark: "#b45309",
    },
    background: {
      default: "hsl(140, 24%, 97%)", // matches global.css
      paper: "#ffffff",
    },
    text: {
      primary: "hsl(140, 24%, 12%)",
      secondary: "hsl(215, 16%, 35%)",
      disabled: "hsl(215, 12%, 55%)",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: "var(--font-jakarta), sans-serif",
    h1: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
    h2: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
    h3: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
    h4: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
    h5: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
    h6: {
      fontFamily: "var(--font-outfit), sans-serif",
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

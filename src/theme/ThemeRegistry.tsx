"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#22c55e", // brand-primary (emerald)
      light: "#4ade80",
      dark: "#15803d",
    },
    secondary: {
      main: "#f59e0b", // brand-secondary (amber)
      light: "#fbbf24",
      dark: "#b45309",
    },
    background: {
      default: "hsl(140, 20%, 6%)", // matches global.css
      paper: "hsla(140, 15%, 11%, 0.95)",
    },
    text: {
      primary: "hsl(140, 20%, 96%)",
      secondary: "hsl(140, 10%, 75%)",
      disabled: "hsl(140, 8%, 50%)",
    },
    divider: "hsla(140, 20%, 100%, 0.07)",
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

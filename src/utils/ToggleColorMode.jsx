import React, { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ToggleColorModeProvider({ children }) {

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("theme_mode");
    return saved === "dark" ? "dark" : "light";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme_mode", next);
          return next;
        });
      },
    }),
    []
  );


 const theme = useMemo(
  () =>
    createTheme({
      palette: { mode, },
      typography: {
        fontFamily: "'Inder', sans-serif",
      },
    }),
  [mode]
);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

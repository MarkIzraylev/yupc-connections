import * as React from "react";
import { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext, ThemeProvider, createTheme } from "@mui/material/styles";
import { red, blue, green, grey } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: red[700],
    },
    secondary: {
      main: blue[500],
    },
    success: {
      main: green[500],
    },
    error: {
      main: red[500],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin",
        },
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",

          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
  cardBgColor: "rgba(0,0,0,0.6)",
  mainBgImageUrl:
    "url(https://i.pinimg.com/originals/81/29/c4/8129c47eea4ca2923d834a0daf316d72.jpg)",
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: red[700],
      light: "#fff",
    },
    secondary: {
      main: blue[500],
    },
    success: {
      main: green[500],
    },
    error: {
      main: red[500],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin",
        },
        body: {
          scrollbarColor: `${grey[500]} ${grey[100]}`,

          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: grey[100],
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: grey[500],
            minHeight: 24,
            border: `3px solid ${grey[100]}`,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
  cardBgColor: "rgba(255,255,255,0.8)",
  mainBgImageUrl: "url(images/paper.jpg)",
});

export default function Root({
  currentPage,
  setCurrentPage,
  openModal,
  setOpenModal,
  loggedIn,
  setLoggedIn,
}) {
  const [searchIntentionSwitchChecked, setSearchIntentionSwitchChecked] =
    React.useState(false);

  const isDarkMode = useSelector((state) => state.theme === "dark");
  const [darkMode, setDarkMode] = React.useState(isDarkMode);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const ThemeContext = createContext({
    darkMode: false,
    toggleTheme: () => {},
  });

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container
          maxWidth={false}
          /*maxHeight={false}*/ disableGutters
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
          style={{
            "--mainBgImageUrl": theme.mainBgImageUrl,
            "--cardBgColor": theme.cardBgColor,
          }}
        >
          <Header
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            openModal={openModal}
            setOpenModal={setOpenModal}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            checked={searchIntentionSwitchChecked}
            setChecked={setSearchIntentionSwitchChecked}
            isDarkMode={isDarkMode}
            setDarkMode={setDarkMode}
          />
          <Outlet
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            openModal={openModal}
            setOpenModal={setOpenModal}
            checked={searchIntentionSwitchChecked}
            setChecked={setSearchIntentionSwitchChecked}
          />
          {currentPage !== "sign-in" && loggedIn && (
            <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
          )}
        </Container>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

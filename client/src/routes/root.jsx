import * as React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red, blue, green } from "@mui/material/colors";
import CssBaseline from '@mui/material/CssBaseline';
import Header from "../components/Header/Header";
import Footer from '../components/Footer/Footer';
import Container from '@mui/material/Container';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
            scrollbarWidth: 'thin',
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
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

export default function Root({currentPage, setCurrentPage, openModal, setOpenModal}) {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        
        <Container maxWidth={false} /*maxHeight={false}*/ disableGutters sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
        }}>
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} />
            <Outlet currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} />
            {currentPage !== 'sign-in' && (
              <Footer currentPage={currentPage} setCurrentPage={setCurrentPage}/>
            )}
            
        </Container>
        
        
    </ThemeProvider>
  );
}

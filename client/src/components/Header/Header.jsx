import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactComponent as Logo } from "../../img/icons/group.svg";
import SvgIcon from "@mui/icons-material/Menu";
import Groups3Icon from "@mui/icons-material/Groups3";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import PeopleIcon from "../PeopleIcon";
import Badge from "@mui/material/Badge";
import axios from "axios";
import SearchIntentionSwitch from "../SearchIntentionSwitch";
import ThemeSwitch from "../ThemeSwitch";
import { API_URL } from "../../constants";
import { useTheme } from "@mui/material";

export default function Header({
  currentPage,
  setCurrentPage,
  openModal,
  setOpenModal,
  loggedIn,
  setLoggedIn,
  checked,
  setChecked,
  isDarkMode,
  setDarkMode,
}) {
  let navigate = useNavigate();
  const handleLogOut = () => {
    axios
      .post(`${API_URL}/logout/`, {
        refresh_token: localStorage.getItem("refreshToken"),
      })
      .then((response) => {
        if (response.status != 200) return;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        navigate("/");
      })
      .catch((error) => console.error(error));
  };

  const theme = useTheme();

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backdropFilter: "blur(30px)",
          boxShadow: "none",
          backgroundImage: "none",
          backgroundColor:
            theme.palette.mode === "light" && theme.palette.primary.light,
        }}
      >
        {console.log(theme)}
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr",
          }}
        >
          {/*  credit:
                        <a target="_blank" href="https://icons8.com/icon/k3UpsZXWEcc2/people">People</a> иконка от <a target="_blank" href="https://icons8.com">Icons8</a>
                    */}
          {/*<IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>*/}

          {currentPage === "swipe" ? (
            <Box>
              <Tooltip title="Инструкция" onClick={() => setOpenModal("guide")}>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "white"
                        : theme.palette.secondary.dark,
                    marginLeft: 0,
                  }}
                >
                  <QuestionMarkIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box></Box>
          )}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Link to="/" onClick={() => setCurrentPage("about-us")}>
              <Tooltip title="Перейти на главную">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ color: "white" }}
                >
                  {/* <Groups3Icon /> */}
                  <Badge
                    badgeContent={"β"}
                    color="primary"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <PeopleIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Link>
          </Box>

          <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
            {currentPage === "about-us" && !loggedIn && (
              <Box sx={{ textAlign: "right" }}>
                <Link to="/signin" onClick={() => setCurrentPage("sign-in")}>
                  <Button
                    sx={theme.palette.mode === "dark" ? { color: "white" } : {}}
                  >
                    Войти
                  </Button>
                </Link>
              </Box>
            )}
            {currentPage === "about-us" && loggedIn && (
              <Box sx={{ textAlign: "right" }}>
                <Button
                  onClick={handleLogOut}
                  sx={theme.palette.mode === "dark" ? { color: "white" } : {}}
                >
                  Выйти
                </Button>
              </Box>
            )}

            {currentPage === "swipe" && (
              <Box sx={{ textAlign: "right" }}>
                <Tooltip
                  title="Фильтр поиска"
                  onClick={() => setOpenModal("filter")}
                >
                  {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ color: "white" }}
                    >
                        <FilterAltIcon />
                    </IconButton> */}

                  <SearchIntentionSwitch
                    checked={checked}
                    setChecked={setChecked}
                  />
                </Tooltip>
              </Box>
            )}

            <Box sx={{ textAlign: "right" }}>
              <Tooltip title="Цветовая тема">
                <ThemeSwitch checked={isDarkMode} setChecked={setDarkMode} />
              </Tooltip>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

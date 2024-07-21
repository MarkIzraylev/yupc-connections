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
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

export default function Header() {
  return (
    <Box>
      <AppBar position="static" sx={{backdropFilter: 'blur(30px)'}}>
        <Toolbar>
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
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Link to="/">
                <Tooltip title="Перейти на главную">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ color: "white" }}
                    >
                        <Groups3Icon />
                    </IconButton>
                </Tooltip>
            </Link>
          </Box>

          {/*<Button color="inherit">Войти</Button>*/}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

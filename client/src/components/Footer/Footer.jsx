import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Link, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Dispatch } from 'react';

export default function Footer({currentPage, setCurrentPage}) {
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setCurrentPage(newValue);
    navigate('/' + newValue, {replace: true})
  };

  return (
    <BottomNavigation sx={{ width: 1 }} value={currentPage} onChange={handleChange}>
      <BottomNavigationAction
        label="СВАЙПЫ"
        value="swipe"
        icon={<Tooltip title="Свайпы (просмотр анкет)"><FavoriteBorderOutlinedIcon /></Tooltip>}
      />
      <BottomNavigationAction
        label="МЭТЧИ"
        value="match"
        icon={<Tooltip title="Мэтчи (взаимные симпатии)"><Diversity1OutlinedIcon /></Tooltip>}
      />
      <BottomNavigationAction
        label="ВХОДЯЩИЕ"
        value="inbox"
        icon={<Tooltip title="Входящие симпатии"><VolunteerActivismOutlinedIcon /></Tooltip>}
      />
      <BottomNavigationAction
        label="ПРОФИЛЬ"
        value="profile"
        icon={<Tooltip title="Профиль"><PersonOutlinedIcon /></Tooltip>}
      />
    </BottomNavigation>
  );
}

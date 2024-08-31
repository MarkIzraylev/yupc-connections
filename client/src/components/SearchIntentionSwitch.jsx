import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';

import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { renderToStaticMarkup } from 'react-dom/server';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector, useDispatch } from 'react-redux'

export default function SearchIntentionSwitch() {
    const checked = useSelector((state) => state.filters.searchesLove)
    const dispatch = useDispatch()
    const convertSvg = (svg) => {
        const iconSvg = renderToStaticMarkup(svg);
        const svgIconWithXlmns = iconSvg.replace(
            "<svg ",
            '<svg xmlns="http://www.w3.org/2000/svg" fill="white" width="18" '
          );
        const dataUri = `url('data:image/svg+xml,${svgIconWithXlmns}')`;
        return dataUri;
    };
    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        opacity: disabled ? 0.8 : 1,

        '& .MuiSwitch-switchBase': {
          margin: 1,
          padding: 0,
          transform: 'translateX(6px)',
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
              backgroundImage: convertSvg(<FavoriteIcon />),
              borderRadius: '50%',
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.primary.main,
              }),
            },
            '& + .MuiSwitch-track': {
              opacity: 0.5,
              backgroundColor: '#aab4be',
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.primary.main,
              }),
            },
          },
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: '#001e3c',
          width: 32,
          height: 32,
          '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: convertSvg(<PeopleIcon />),
          },
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.success.main,
          }),
        },
        '& .MuiSwitch-track': {
          opacity: 0.5,
          backgroundColor: '#aab4be',
          borderRadius: 20 / 2,
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.success.main,
          }),
        },
    }));
    const [disabled, setDisabled] = useState(false);
    // const [checked, setChecked] = useState(false);
    function onSwitch(ev) {
        //setChecked(ev.target.checked)
        dispatch({type: 'filters/toggleSearchesLove'})
        setDisabled(true);
        setTimeout(() => {
            setDisabled(false);
        }, 5000)
    }
    return (
        <FormControlLabel sx={{ m: 0 }}
            control={<MaterialUISwitch disabled={disabled} checked={checked} sx={{ m: 0 }} onChange={onSwitch}/>}
            // label="Цель"
        />
    );
}
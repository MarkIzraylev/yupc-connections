import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumIcon from '@mui/icons-material/Forum';
import Groups3Icon from '@mui/icons-material/Groups3';
import SwipeIcon from '@mui/icons-material/Swipe';
import { Dispatch, useEffect } from 'react';
import { Container, Paper, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
  } from '@mui/lab/TimelineOppositeContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

export default function AboutUs({setCurrentPage}) {
    useEffect(() => {
        setCurrentPage('about-us')
    }, [])
    return (
        <Container style={{ flexGrow: 1}}>
            <Typography variant={useMediaQuery(useTheme().breakpoints.up('sm')) ? "h2" : "h3"} textAlign="center" mt={{xs: 2, md: 8}} mb={{xs: 2, md: 8}} p={2}>ЯГК Знакомства<sup style={{fontSize: 20, color: useTheme().palette.error.main}}> Beta</sup></Typography>
            
            <Timeline
                sx={!useMediaQuery(useTheme().breakpoints.up('sm')) && {
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    }
                  }}
                {...{position: useMediaQuery(useTheme().breakpoints.up('sm')) ? 'alternate' : 'right'}}
            >
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined">
                        <NotesOutlinedIcon />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">Заполни небольшую анкету</Typography>
                        <Typography variant="subtitle1">Укажи основную информацию о себе и своих хобби.</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary">
                        <SwipeIcon color="primary" />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">Свайпай анкеты других</Typography>
                        <Typography variant="subtitle1">Свайп вправо означает симпатию, влево - пропуск анкеты.</Typography>
                        
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="secondary">
                        <FavoriteIcon color="secondary" />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">Получай взаимные свайпы (мэтчи)</Typography>
                        <Typography variant="subtitle1">Когда два пользователя посылают друг другу симпатию, возникает мэтч.</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary">
                        <ForumIcon color="primary" />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">Переходи в ТГ или ВК и общайся с мэтчами</Typography>
                        <Typography variant="subtitle1">Чтобы не потерять контакт, продолжай общаться в привычном мессенджере.</Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot variant="outlined">
                        <Groups3Icon />
                    </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="h6">Развивай связи</Typography>
                        <Typography variant="subtitle1">Строй дружеские или романтические отношения, находи компаньонов для совместного участия в олимпиадах и хакатонах.</Typography>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </Container>
    )
}
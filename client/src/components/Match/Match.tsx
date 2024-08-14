import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTheme } from '@mui/material/styles';
import Skeleton from "@mui/material/Skeleton";

import { Dispatch, useEffect, useState } from 'react';
import axios from 'axios';

export default function Match({setCurrentPage}: {setCurrentPage: Dispatch<string>}) {
    const theme = useTheme();
    const [matches, setMatches] = useState<any[] | null>(null);
    function getMatches() {
        axios.get('http://127.0.0.1:8000/api/getMatch/')
        .then(function (response) {
            setMatches(response.data.users);
            console.log('matches are: ', response.data.users)
        })
        .catch(function (error) {
            console.log(error);

        });
    }

    useEffect(() => {
        setCurrentPage('match')
        getMatches()
    }, [])

    const [imageLoaded, setImageLoaded] = useState(false);
    const [profileImageWidth] = useState(60);
    const [profileImageMargins] = useState(theme.spacing(1.5));
    const [cardContentPaddings] = useState(theme.spacing(1.5));
    const [maxCardWidth] = useState(700);

    // cute gif: https://i.pinimg.com/originals/df/6f/ab/df6fabcd43d699238b0a60e085d38fab.gif
    return (
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url(https://i.pinimg.com/originals/81/29/c4/8129c47eea4ca2923d834a0daf316d72.jpg)', backdropFilter: 'blur(15px)' }}>
            <Card sx={{background: '#121212', width: `clamp(250px, 90vw, ${maxCardWidth}px)`, paddingBottom: theme.spacing(1), marginTop: theme.spacing(1)}}>
                {
                matches === null || matches === undefined ? (
                    [0].map(i => {
                        return (<Skeleton variant="rectangular" sx={{marginInline: theme.spacing(1), marginTop: theme.spacing(1), height: `calc(${profileImageWidth}px + ${profileImageMargins} + ${profileImageMargins})`}} />)
                    })
                ) : (
                    matches.map((match, ind) => {
                        console.log(match)
                        
                        // return <div key={match.id}>{match.first_name} {match.last_name} {match.description}</div>
                        return (
                            <Card sx={{ display: 'flex', marginTop: theme.spacing(1), marginInline: theme.spacing(1), alignItems: 'center', maxWidth: maxCardWidth }}>
                                <Skeleton variant="circular" sx={{width: profileImageWidth, height: profileImageWidth, aspectRatio: '1', display: !imageLoaded ? 'block' : 'none', margin: profileImageMargins, marginRight: 0}} />
                                <CardMedia
                                component="img"
                                sx={{ width: profileImageWidth, height: profileImageWidth, aspectRatio: '1', borderRadius: '50%', margin: profileImageMargins, marginRight: 0, display: imageLoaded ? 'block' : 'none' }}
                                image={`http://127.0.0.1:8000/${match.image}`}
                                alt="Изображение пользователя"
                                onLoad={() => {if (ind === matches.length - 1) {setImageLoaded(true)}}}
                                />
                                
                                <CardContent style={{width: `calc(100% - ${profileImageWidth}px - ${cardContentPaddings})`, padding: cardContentPaddings}}>
                                    <Typography component="div" variant="h6" style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                    {match.first_name} {match.sur_name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
                                    {match.description}
                                    </Typography>
                                </CardContent>
                                
                            </Card>
                        )
                    })
                )
            }
            </Card>
            
        </div>
    )
}
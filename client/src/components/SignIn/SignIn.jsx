import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function SignIn({setCurrentPage}) {
    useEffect(() => {
        setCurrentPage('sign-in')
    }, [])
    let bgImgsSrcs = [
        "https://i.pinimg.com/originals/79/96/65/799665b442c92830edc705db721f38c1.jpg",
        "https://i.pinimg.com/originals/bc/8c/e0/bc8ce0552875a4a04d7cd77ea3b7521b.jpg",
        "https://i.pinimg.com/originals/08/33/ea/0833ea60a1563a4f8d44ae03a2e153cd.jpg",
        "https://i.pinimg.com/originals/8c/6a/8d/8c6a8d65db4696c900befac028a73fba.jpg",
        "https://i.pinimg.com/originals/f7/d4/ef/f7d4efc04d11c5ba336e2eba406a9c6a.jpg",
    ]
    let bgImgSrc = bgImgsSrcs[bgImgsSrcs.length-1];
    return (
        <Box style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url("${bgImgSrc}")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}}>
            <Card sx={{maxWidth: '500px', height: 'fit-content', minWidth: '350px', minHeight: '100px'}} variant="outlined">
                <CardContent>
                    <Typography gutterBottom variant="h5" mb={1}>
                        Авторизация
                    </Typography>
                    <Box sx={{display: 'grid', flexDirection: 'column', gap: '1rem'}}>
                        <TextField label="Логин" variant="standard" />
                        <TextField label="Пароль" variant="standard" type="password" />
                    </Box>
                    
                </CardContent>
                <CardActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Link to="/signup" size="small" style={{color: 'lightgray'}}>
                        <Button size="small" color="inherit">Создать аккаунт</Button>
                    </Link>

                    <Button size="small" color="primary">Войти</Button>
                </CardActions>
            </Card>

        </Box>
    )
}
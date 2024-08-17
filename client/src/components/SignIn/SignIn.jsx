import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SignIn({setCurrentPage, loggedIn, setLoggedIn}) {
    let navigate = useNavigate();

    useEffect(() => {
        setCurrentPage('sign-in')
    }, [])
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmitForm = () => {    
        axios.post('http://127.0.0.1:8000/api/login/', {
            username: email,
            password: password,
        })
        .then(response => {
            if (response.status != 200) return
            console.log('resp',response)
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            setError(null);
            console.log('success')
            setLoggedIn(true);
            navigate('/swipe')
        })
        .catch(error => {
            console.error(error.response);
            setError(`Ошибка входа. ${error.response.data.error}.`);
        })
    }

    return (
        <Box className="wallpaperBackground" style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Card sx={{maxWidth: '500px', height: 'fit-content', minWidth: '350px', minHeight: '100px'}} variant="outlined">
                <CardContent>
                    <Typography gutterBottom variant="h5" mb={1}>
                        Авторизация
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        {error}
                    </Typography>
                    <Box sx={{display: 'grid', flexDirection: 'column', gap: '1rem'}}>
                        <TextField label="Эл. почта" variant="standard" value={email} onChange={(ev) => setEmail(ev.target.value)} />
                        <TextField label="Пароль" variant="standard" type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
                    </Box>
                </CardContent>
                <CardActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                    {/* <Link to="/signup" size="small" style={{color: 'lightgray'}}>
                        <Button size="small" color="inherit">Создать аккаунт</Button>
                    </Link> */}

                    <Button size="small" color="primary" onClick={handleSubmitForm}>Войти</Button>
                </CardActions>
            </Card>

        </Box>
    )
}
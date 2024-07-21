import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Mikhail from '../../static/images/Mikhail.jpg';
import Chip from '@mui/material/Chip';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { useState, useRef } from 'react';

export default function Swipe() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    function handleCardDrag(ev: any) {
        /*if (cardRef.current) {
            if(ev.type == 'touchstart' || ev.type == 'touchmove' || ev.type == 'touchend' || ev.type == 'touchcancel'){
                
                var x = ev.changedTouches[0].clientX;
            } else {
                var x = ev.clientX;
            }
            cardRef.current.style.marginLeft = `${x}px`;
        }
        
        console.log(`${x}px`)*/
    }
    function handleTouchMove(ev: React.TouchEvent<HTMLDivElement>): void {
        handleCardDrag(ev)
    }
    function handleDrag(ev: React.DragEvent<HTMLDivElement>): void {
        handleCardDrag(ev)
    }
    return (
        <>
            <Stack sx={{ flexGrow: 1 }}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={0} style={{alignItems: "center", height: '100%', width: '100%'}}>
                        <Grid item sx={{width: '100%', backgroundColor: 'none', display:'flex', justifyContent:'center'}} p={2} justifyContent="center">
                            <div draggable="true" onDrag={handleDrag} onTouchMove={handleTouchMove} ref={cardRef}>
                            <Card  sx={{maxWidth: '600px', maxHeight: '620px', overflowY: 'scroll'}}>
                                {!imageLoaded && <Skeleton variant="rectangular" height={400} />}
                                <CardMedia
                                    component="img"
                                    alt="Изображение пользователя"
                                    height="400"
                                    
                                    image={Mikhail}
                                    sx={{
                                        position: 'sticky',
                                        top: 0,
                                        opacity: imageLoaded ? '1' : '0'
                                    }}
                                    onLoad={prev => setImageLoaded(true)}
                                />
                                <CardContent sx={{position: 'relative', backdropFilter: 'blur(30px)', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                                    <Box sx={{
                                        display: 'grid',
                                        flexDirection: 'row',
                                        gridTemplateColumns: '1fr auto'
                                    }}>
                                        <Typography mb={2} variant="h5" noWrap component="div">
                                        Израйлев Марк Олегович
                                        </Typography>
                                        <IconButton size="small" sx={{height: 'fit-content'}}>
                                            <FlagOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                    
                                    <Stack mb={2} spacing={1} direction="row" useFlexGap flexWrap="wrap">
                                        
                                        <Chip label="3 курс" variant="outlined" />
                                        <Chip label="Осн. корпус" variant="outlined" />
                                        <Chip label="ОИТ" variant="outlined" />
                                        <Chip label="Ищу дружбу" variant="outlined" color="success" />

                                    </Stack>
                                    <Typography variant="subtitle1" mb={1}>
                                    О себе
                                    </Typography>
                                    <Typography variant="body2" mb={2} sx={{
                                        /*overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",*/
                                    }}>
                                    Люблю программирование и свою кошку Мусю. Иногда участвую в олимпиадах, поэтому если вы тоже заинтересованы в подобном, смело пишите и может быть поучаствуем вместе.
                                    </Typography>
                                    
                                    <Typography variant="subtitle1" mt={1} mb={1}>
                                    Хобби
                                    </Typography>
                                    <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
                                        
                                        <Chip label="Программирование" variant="outlined" />
                                        <Chip label="Прогулки" variant="outlined" />
                                        <Chip label="Чтение" variant="outlined" />
                                        <Chip label="Прослушивание музыки" variant="outlined" />
                                        <Chip label="Иностранные языки" variant="outlined" />
                                        <Chip label="Веб-разработка" variant="outlined" />
                                        <Chip label="Рукоделие" variant="outlined" />
                                        <Chip label="Рисование" variant="outlined" />

                                    </Stack>
                                </CardContent>
                            </Card>
                            </div>
                        </Grid>
                        <Grid item md={12} sx={{width: '100%'}}>
                            <Stack direction="row" justifyContent="center" spacing={10} sx={{width: '100%'}}>
                                <Tooltip title="Пропустить анкету">
                                    <IconButton color="error" size="large">
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Отправить симпатию">
                                    <IconButton color="success" size="large">
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </>
    )
}
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
import { useState, useRef, useEffect } from 'react';

export default function Swipe({currentPage, setCurrentPage}: {currentPage?: any, setCurrentPage?: any}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [dragStart, setDragStart] = useState<number>(NaN);
    const [dragStartAfterThreshold, setDragStartAfterThreshold] = useState<number>(NaN);
    const [dragCurrent, setDragCurrent] = useState<number>(NaN);

    var blankImg = document.createElement('img');
    blankImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    const cardRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    // расстояние по горизонтали, на которое нужно протянуть карточку с анкетой вправо или влево, чтобы послать симпатию или пропустить анкету
    const diffForDecision = 140;

    // полосы по бокам, которые появляются на фоне, когда по горизонтали карточку тянут на расстояние >= diffForDecision, и символизируют действие
    // в зависимости от направления свайпа
    const [acceptColor, rejectColor] = ['green', 'red'];
    const decisionStripeWidth = 100;

    // скорости перемещения и вращения карточки
    const [cardDragSpeed, cardRotationSpeed] = [1.5, 1/15];

    // расстояние по горизонтали, при преодолении которого перетаскиванием карточки анкеты, начинает свое движение карточка анкеты
    // оно нужно, чтобы небольшие движения по горизонтали при прокручивании анкеты не мешали восприятию информации
    const cardDragThreshold = 40;

    function handleCardDrag(ev: any) {

        const touchTypes = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const x = touchTypes.includes(ev.type) ? ev.changedTouches[0].clientX : ev.clientX;
        
        backgroundRef.current!.style["boxShadow"] = (() => {
            if (Math.abs(dragCurrent - dragStart) >= diffForDecision) {
                // console.log(dragCurrent, dragStart)
                return `inset ${decisionStripeWidth * (dragCurrent > dragStart ? -1 : 1)}px 0 100px -100px ${dragCurrent > dragStart ? acceptColor : rejectColor}`;
            }
            return '';
        })()
        
        if(Math.abs(dragStart - x) >= cardDragThreshold) {
            // console.log(dragStart, dragCurrent, dragStartAfterThreshold)
            setDragCurrent(x)
            if ((dragStart !== dragCurrent) && Number.isNaN(dragStartAfterThreshold)) {
                setDragStartAfterThreshold(x)
                // console.log('->', x)
            }
        } else if (!Number.isNaN(dragStartAfterThreshold)) {
            setDragCurrent(x)
        }
    }
    function handleDragStart(ev: React.DragEvent<HTMLDivElement>): void {
        setDragStart(ev.clientX)
        setDragCurrent(ev.clientX)
        console.log(ev.dataTransfer);
        
        ev.dataTransfer.setDragImage(blankImg, 0, 0)

    }
    function handleTouchStart(ev: React.TouchEvent<HTMLDivElement>): void {
        setDragStart(ev.changedTouches[0].clientX)
        setDragCurrent(ev.changedTouches[0].clientX)
    }
    function handleTouchEnd(ev: React.TouchEvent<HTMLDivElement>): void {
        if (Math.abs(dragCurrent - dragStart) < diffForDecision) {
            setDragCurrent(0)
            
        }
        setDragStartAfterThreshold(NaN)
        
    }
    function handleDragEnd(ev: React.DragEvent<HTMLDivElement>): void {
        if (Math.abs(dragCurrent - dragStart) < diffForDecision) {
            setDragCurrent(0)
            

        }
        setDragStartAfterThreshold(NaN)
        
        
        // оставляет карточку на месте после драга
        //setDragCurrent(ev.clientX)
    }
    useEffect(() => {
        const cardStyle = cardRef.current!.style;

        [cardStyle.marginLeft, cardStyle.transform] = (() => {
            return dragCurrent !== 0 ? [`${(dragCurrent - dragStartAfterThreshold) * cardDragSpeed}px`, `rotate(${(dragCurrent - dragStartAfterThreshold) * cardRotationSpeed}deg)`] : ['0px', 'rotate(0deg)']
        })();

        if (dragCurrent === 0) {
            backgroundRef.current!.style["boxShadow"] = ''
        }
    }, [dragCurrent])
    useEffect(() => {
        //setCurrentPage('swipe');
        
    }, []);
    return (
        <>
            <Stack sx={{ flexGrow: 1, overflow:'hidden' }}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={0} style={{alignItems: "center", height: '100%', width: '100%', transition: '0.2s'}} ref={backgroundRef}>
                        <Grid item sx={{width: '100%', backgroundColor: 'none', display:'flex', justifyContent:'center'}} p={2}>
                            <div className='swipe-card' draggable="true" onDrag={handleCardDrag} onTouchMove={handleCardDrag} onDragStart={handleDragStart} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onDragEnd={handleDragEnd} onDragExit={handleDragEnd} onTouchCancel={handleTouchEnd} ref={cardRef}>
                            <Card sx={{width: '90vw', maxWidth: '570px', height: '65vh', minHeight: '370px', overflowY: 'scroll'}}>
                                {!imageLoaded && <Skeleton variant="rectangular" height='400px' />}
                                <CardMedia
                                    component="img"
                                    alt="Изображение пользователя"
                                    height='400px'
                                    
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
                                    <IconButton color="error" size="large" sx={{border: '1px solid'}}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Отправить симпатию">
                                    <IconButton color="success" size="large" sx={{border: '1px solid'}}>
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
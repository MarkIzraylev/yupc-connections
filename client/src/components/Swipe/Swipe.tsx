import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useState, useRef, useEffect, Dispatch } from 'react';

import SwipeCard from '../SwipeCard/SwipeCard';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type modalType = string | null;

interface swipeProps {
    setCurrentPage: Dispatch<string>,
    openModal: modalType,
    setOpenModal: Dispatch<modalType>,
    loggedIn: boolean
}

export default function Swipe({setCurrentPage, openModal, setOpenModal, loggedIn}: swipeProps) {
    let navigate = useNavigate();
    const [dragStart, setDragStart] = useState<number>(NaN);
    const [dragStartAfterThreshold, setDragStartAfterThreshold] = useState<number>(NaN);
    const [dragCurrent, setDragCurrent] = useState<number>(NaN);

    // const reducer = (state, action) => {
    //     switch (action.type) {
    //         case 'LOAD_BUNCH':
    //             ...
    //             return ......
    //         case 'SHOW_NEXT':

    // }

    interface cardObj {
        id: number;
        first_name: string;
        last_name: string;
        sur_name: string;
        image: string;
        description: string;
        is_search_friend: boolean;
        is_search_love: boolean;
        hobbies: string[];
    }

    const [currentCardId, setCurrentCardId] = useState<number>(0);

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
        //console.log('dragStart:', dragStart, 'ev.clientX:', ev.clientX, ev)
        const x = touchTypes.includes(ev.type) ? ev.changedTouches[0].clientX : ev.clientX;
        
        backgroundRef.current!.style["boxShadow"] = (() => {
            if (Math.abs(dragCurrent - dragStart) >= diffForDecision) {               
                return `inset ${decisionStripeWidth * (dragCurrent > dragStart ? -1 : 1)}px 0 100px -100px ${dragCurrent > dragStart ? acceptColor : rejectColor}`;
            }
            return '';
        })()
        
        if(Math.abs(dragStart - x) >= cardDragThreshold) {
            // console.log(dragStart, dragCurrent, dragStartAfterThreshold)
            if ((dragStart !== dragCurrent) && Number.isNaN(dragStartAfterThreshold)) {
                setDragStartAfterThreshold(x)
            }
        }
        if (x !== 0) {
            setDragCurrent(x)
        }
    }
    function handleDragStart(ev: React.DragEvent<HTMLDivElement>): void {
        setDragStart(ev.clientX)
        setDragCurrent(ev.clientX)
        
        ev.dataTransfer.setDragImage(blankImg, 0, 0)
    }
    function handleTouchStart(ev: React.TouchEvent<HTMLDivElement>): void {
        setDragStart(ev.changedTouches[0].clientX)
        setDragCurrent(ev.changedTouches[0].clientX)
    }
    function sendSwipe(swipedUserId: number, swipeType: boolean) {
        console.log(`send '${swipeType ? 'accept' : 'reject'}' swipe to a user whose id = ${swipedUserId}`)
        // post data to server
        axios.post('http://127.0.0.1:8000/api/swipeUser/', {
            
            target_user_id: swipedUserId,
            is_like: swipeType
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const [currentBunchOfCards, setCurrentBunchOfCards] = useState<cardObj[] | null>(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [noCardsLeft, setNoCardsLeft] = useState(false);
    //git commit -m "feature: add auth credentials for matches page"
    function fetchNewBunchOfCards(): void | boolean {
        setCurrentBunchOfCards(null)
        let nextBunchOfCards: cardObj[];
        axios.get('http://127.0.0.1:8000/api/userList/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(response => {
            console.log('resp', response)
            if (response.status === 200) {
                nextBunchOfCards = response.data.users;
                console.log(response.data.users)
                nextBunchOfCards.length !== 0 ? setCurrentBunchOfCards(nextBunchOfCards) : setNoCardsLeft(true);
            }
        }).catch(err => {
            setErrorMessage(err.response.status);
            console.error(err);
            
            //return false;
        });
    }

    useEffect(() => {
        if (!loggedIn) {
            navigate('/signin');
        }
    }, [])

    function performSwipe(swipeType: boolean) {
        if (!currentBunchOfCards) {
            return false;
        }

        sendSwipe(currentBunchOfCards[currentCardId].id, swipeType)

        if (currentCardId === currentBunchOfCards.length - 1) {
            // fetch new bunch of cards via API
            fetchNewBunchOfCards()
        }

        setCurrentCardId(prev => (prev + 1) % currentBunchOfCards.length)
    }

    function handleCardMoveEnd() {
        setTimeout(() => {
            setDragStart(0)
            setDragCurrent(0)
            setDragStartAfterThreshold(NaN)

            performSwipe(dragCurrent > dragStart)
        }, 300)
    }
    function handleTouchEnd(ev: React.TouchEvent<HTMLDivElement>): void {
        if (Math.abs(dragCurrent - dragStart) < diffForDecision) {
            setDragCurrent(0)
            setDragStart(0)
            
        } else {
            handleCardMoveEnd()
        }
        setDragStartAfterThreshold(NaN)
    }
    function handleDragEnd(ev: React.DragEvent<HTMLDivElement>): void {
        handleCardDrag(ev)
        if (Math.abs(dragCurrent - dragStart) < diffForDecision) {
            setDragCurrent(0)
            setDragStart(0)

        } else {
            handleCardMoveEnd()
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
        setCurrentPage('swipe')
        // fetching new cards at the component's mount
        fetchNewBunchOfCards()
    }, []);
    function swipeCardJSX(card: cardObj) {
        let intentionTagsArr = []
        if (card.is_search_friend) {
            intentionTagsArr.push('Ищу дружбу')
        }
        if (card.is_search_love) {
            intentionTagsArr.push('Ищу любовь')
        }
        return (
            <SwipeCard
                name={`${card.last_name} ${card.first_name} ${card.sur_name ? card.sur_name : ''}`}
                mainTags={['3 курс', 'Осн. корпус', 'ОИТ']}
                hobbiesTags={card.hobbies}
                intentionTags={intentionTagsArr}
                description={card.description}
                imageSrc={card.image ? `http://127.0.0.1:8000/${card.image}` : 'https://i.pinimg.com/736x/c6/c3/0d/c6c30d611b4cdef5a4d73a54c3e0055b.jpg'}
                setOpenModal={setOpenModal}
            />
        )
    }
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 350,
        width: '90vw',
        maxWidth: 600,
        maxHeight: '60vh',
        overflowY: 'auto',

        bgcolor: 'background.paper',
        // border: '2px solid #000',
        // boxShadow: 24,
        p: 4,
      };
    const [complaint, setComplaint] = useState<string>('')
    return (
        <>
            <Stack sx={{ flexGrow: 1, overflow:'hidden' }}>
                <Modal
                    open={openModal === "filter"}
                    onClose={() => setOpenModal(null)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h3" gutterBottom>
                        Фильтры для поиска
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Данное окно находится в процессе разработки.
                    </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModal === "guide"}
                    onClose={() => setOpenModal(null)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h3" gutterBottom>
                        Инструкция
                    </Typography>
                    <Typography variant="h6" component="h4" gutterBottom>
                        О странице свайпов
                    </Typography>
                    <Typography id="modal-modal-description" gutterBottom>
                        На данной странице можно просматривать анкеты других пользователей.
                    </Typography>
                    <Typography variant="h6" component="h4" gutterBottom>
                        Подсказки
                    </Typography>
                    <Typography id="modal-modal-description" gutterBottom>
                        Иногда в тексте встречаются подсказки (<Tooltip title="Подсказка">
                            <IconButton aria-label="info" size="small">
                                <InfoOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>). Чтобы воспользоваться подсказкой, наведите на неё курсор или зажмите долгим нажатием.
                    </Typography>
                    <Typography variant="h6" component="h4" gutterBottom>
                        Просмотр анкет
                    </Typography>
                    <Typography id="modal-modal-description" gutterBottom>
                        Чтобы посмотреть больше инфорации о пользователе, прокрутите анкету, наведя на неё курсор мыши и покрутив колёсико мыши или свайпнув
                        <Tooltip title="Свайп - это смахивание, т.е. движение (обычно по прямой) по экрану пальцем или зажатым курсором мыши.">
                            <IconButton aria-label="info" size="small">
                                <InfoOutlinedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip> вверх (для устройств с сенсорным экраном).
                    </Typography>
                    <Typography variant="h6" component="h4" gutterBottom>
                        Принятие и отклонение анкет
                    </Typography>
                    <Typography id="modal-modal-description" gutterBottom>
                        Чтобы послать пользователю симпатию, нажмите на галочку внизу экрана или сделайте свайп вправо. Чтобы отклонить анкету - крестик внизу экрана или свайп влево.
                    </Typography>
                    <Typography variant="h6" component="h4" gutterBottom>
                        Закрытие окон
                    </Typography>
                    <Typography id="modal-modal-description" gutterBottom>
                        Для закрытия модального окна (например, текущего), нажмите в любом месте веб-страницы за его пределами.
                    </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={openModal === "complaint"}
                    onClose={() => setOpenModal(null)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Жалоба на анкету
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                            Пожалуйста, укажите причину жалобы.
                        </Typography>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Причина жалобы</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={complaint}
                                label="Причина жалобы"
                                onChange={(event) => setComplaint(event.target.value)}
                                color="primary"
                                >
                                <MenuItem value={'insult'}>Оскорбления</MenuItem>
                                <MenuItem value={'nsfw'}>Контент +18</MenuItem>
                                <MenuItem value={'other'}>Другая причина</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ minWidth: 120, mt: 2, display: 'flex', justifyContent: 'right' }}>
                            <Button color="inherit">Отправить</Button>
                        </Box>
                    </Box>
                </Modal>


                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={0} style={{alignContent: "space-evenly", height: '100%', width: '100%', transition: '0.2s'}} ref={backgroundRef}>
                        <Grid item sx={{width: '100%', backgroundColor: 'none', display:'flex', justifyContent:'center'}} p={2}>
                            <div className='swipe-card' draggable="true" onDrag={handleCardDrag} onTouchMove={handleCardDrag} onDragStart={handleDragStart} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onDragEnd={handleDragEnd} onDragExit={handleDragEnd} onTouchCancel={handleTouchEnd} ref={cardRef}>
                                {
                                    (!errorMessage && currentBunchOfCards && !noCardsLeft) && (
                                        swipeCardJSX(currentBunchOfCards[currentCardId])
                                    )
                                }
                                
                            </div>
                            {
                                errorMessage && (
                                    <Alert severity="error">Ошибка загрузки данных с сервера. Код ошибки: {errorMessage}. Пожалуйста, попробуйте зайти на страницу позднее.</Alert>
                                )
                            }

                            {
                                (!errorMessage && !currentBunchOfCards && !noCardsLeft) && (
                                    <Alert severity="info">Загрузка...</Alert>
                                )
                            }

                            {
                                noCardsLeft && (
                                    <Alert severity="info">Вы свайпнули все карточки, что есть на данный момент по данному фильтру.</Alert>
                                )
                            }
                        </Grid>
                        <Grid item md={12} sx={{width: '100%'}} style={{display: (currentBunchOfCards && !noCardsLeft) ? 'block' : 'none'}}>
                            {
                                (currentBunchOfCards && !noCardsLeft) && (
                                    <Stack direction="row" justifyContent="center" spacing={10} sx={{width: '100%', height: '65px'}}>
                                        <Tooltip title="Пропустить анкету">
                                            <IconButton color="error"  sx={{border: '1px solid', aspectRatio: '1'}} onClick={() => performSwipe(false)}>
                                                <CloseIcon sx={{width: '70%', height: '70%'}} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Отправить симпатию">
                                            <IconButton color="success" size="large" sx={{border: '1px solid', aspectRatio: '1'}} onClick={() => performSwipe(true)}>
                                                <CheckIcon sx={{width: '70%', height: '70%'}} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                )
                            }
                            
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </>
    )
}
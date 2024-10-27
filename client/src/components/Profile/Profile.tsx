import { Stack, Alert, Box, Modal, Card, CardContent, CardActions, Typography, Button, TextField, FormLabel, Paper, FormControl, FormGroup, FormControlLabel, Checkbox, MenuItem, Select, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Dispatch, useEffect, useState } from 'react';
import { cardObjToSwipeCard } from '../cardObjToSwipeCard';
import { cardObj, modalStyle } from '../cardObjInterface';
import axios from 'axios';
import {API_URL} from '../../constants';

export default function Profile({setCurrentPage, openModal, setOpenModal}: {setCurrentPage: Dispatch<string>, openModal: string | null, setOpenModal: Dispatch<string | null>}) {
    const [profileCard, setProfileCard] = useState<cardObj | null>(null);

    function fetchProfile() {
        // fetch profile data from API
        axios.get(`${API_URL}/profileData/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(response => {
            console.log('resp in profile:', response)
            const profileCard = response.data.user_data
            setProfileCard(profileCard)
            firstNameInputProps.setValue(profileCard.first_name)
            lastNameInputProps.setValue(profileCard.last_name)
            descriptionInputProps.setValue(profileCard.description)
            setIsSearchFriend(profileCard.is_search_friend)
            setIsSearchLove(profileCard.is_search_love)
            setIsBoy(profileCard.is_boy)
        })
        .catch(err => console.log('err in profile:', err))
        // set profile data to state
    }

    const [validate, setValidate] = useState(false);
    const [validationError, setValidationError] = useState(false);

    function useFormInput(label: string, helperText: string, pattern: string, required?: boolean) {
        const [value, setValue] = useState('');
        const [error, setError] = useState<boolean | undefined>(false);

        function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
            setValue(ev.target.value);
            setError(!ev.target.validity.valid || ev.target.value === '' && required);
        }

        return {
            label: label,
            value: value,
            error: error || (required ? (value === '' && validate) : false),
            onChange: onChange,
            helperText: (error || (required ? (value === '' && validate) : false)) && helperText,
            inputProps: {pattern: pattern},
            required: required,
            setValue: setValue
        }
    }
    
    useEffect(() => {
        setCurrentPage('profile')
        fetchProfile()
        // let sampleCard = {
        //     id: 123,
        //     first_name: "Рей",
        //     last_name: "Оливер",
        //     sur_name: "Загадка",
        //     course_name: "4 курс",
        //     building_name: "Осн. корпус",
        //     department_name: "ОИТ",
        //     hobbies: ["Лежать на диване", "Ничего не делать"],
        //     is_search_friend: true,
        //     is_search_love: true,
        //     description: "Шла ночь... Смеркалось... Я искал тех, с кем можно разделить минуты горести и печали, скуку и занятость...",
        //     image: "",
        //     tg_contact: "https://t.me/northurljous",
        //     vk_contact: "https://vk.com/smth",
        //     is_boy: true
        // }
        // setProfileCard(sampleCard)
        // firstNameInputProps.setValue(sampleCard.first_name)
        // lastNameInputProps.setValue(sampleCard.last_name)
        // descriptionInputProps.setValue(sampleCard.description)
        // setIsSearchFriend(sampleCard.is_search_friend)
        // setIsSearchLove(sampleCard.is_search_love)
        // setIsBoy(sampleCard.is_boy)
        // setProfileImage(blob_image_of_profile_should_be_here)
    }, [])

    const firstNameInputProps = useFormInput('Имя', 'Имя должно содержать от 1 до 50 символов', ".{1,50}", true);
    const lastNameInputProps = useFormInput('Фамилия', 'Фамилия должна содержать от 1 до 50 символов', ".{1,50}", true);
    const descriptionInputProps = useFormInput('О себе', 'Поле "О себе" должно содержать от 1 до 170 символов', ".{1,170}", true);

    const [profileImage, setProfileImage] = useState<Blob | MediaSource >()
    const [searchIntentionError, setSearchIntentionError] = useState(false);
    const [isSearchFriend, setIsSearchFriend] = useState(false);
    const [isSearchLove, setIsSearchLove] = useState(false);
    const [isBoy, setIsBoy] = useState<boolean | null | string>(null);

    let theme = useTheme();

    return (
        <div className="wallpaperBackground" style={{ flexGrow: 1, display: 'grid'}}>
            <Modal
                open={openModal === "edit-profile"}
                onClose={() => setOpenModal(null)}
                style={{alignSelf: 'center', justifySelf: 'center'}}
            >
                <Card style={{ outline: 'none', padding: 0 }} sx={modalStyle}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Редактирование профиля
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Для сохранения изменённых данных нажмите на соответствующую кнопку снизу.
                        </Typography>
                        <Box sx={{display: 'grid', flexDirection: 'column', gap: 1, mt: 1}}>
                        <FormLabel component="legend" error={!(profileImage != undefined) && validate}>Фотография профиля</FormLabel>
                            {
                                profileImage && <Paper variant="outlined" sx={{aspectRatio: 1, backgroundImage: `url(${URL.createObjectURL(profileImage)})`, backgroundSize: 'cover', backgroundPosition: 'center', }}></Paper>
                            }
                            <Button
                            variant="outlined"
                            component="label"
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                display: "block",
                                textOverflow: "ellipsis" }}
                            >
                                {'Загрузить файл'}
                                <input
                                    type="file"
                                    name="image_url"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    onChange={(ev) => {
                                        if (ev.target.files!.length > 0) {
                                            let data = ev.target.files![0];
                                            setProfileImage(data);
                                        }
                                    }}
                                    hidden
                                />
                            </Button>
                            <TextField variant="standard" {...firstNameInputProps} />
                            <TextField variant="standard" {...lastNameInputProps} />
                            <TextField
                            variant="standard"
                            multiline
                            minRows={1}
                            maxRows={5}
                            {...descriptionInputProps}
                            />
                            <FormControl required error={searchIntentionError && validate}>
                                <FormLabel component="legend">Цель поиска знакомств</FormLabel>
                                <FormGroup style={searchIntentionError && validate ? {color: theme.palette.error.main} : {}}>
                                    <FormControlLabel control={<Checkbox style={searchIntentionError && validate ? {color: theme.palette.error.main} : {}} checked={isSearchFriend} onChange={(ev) => {setIsSearchFriend(ev.target.checked);}} />} label="Ищу дружбу" />
                                    <FormControlLabel control={<Checkbox style={searchIntentionError && validate ? {color: theme.palette.error.main} : {}} checked={isSearchLove} onChange={(ev) => {setIsSearchLove(ev.target.checked);}} />} label="Ищу отношения" />
                                </FormGroup>
                            </FormControl>
                            <FormControl fullWidth style={{marginBottom: 8}} required error={isBoy === null && validate}>
                                <InputLabel>Ваш пол</InputLabel>
                                <Select
                                    value={isBoy ? "male" : "female"}
                                    label="Ваш пол"
                                    onChange={(ev) => setIsBoy(ev.target.value === "male")}
                                    
                                >
                                    <MenuItem value="female">Женский</MenuItem>
                                    <MenuItem value="male">Мужской</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </CardContent>
                    <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button color="secondary" onClick={() => setOpenModal(null)}>Отменить</Button>
                        <Button color="error" >Сохранить</Button>
                    </CardActions>
                </Card>
            </Modal>
            {
                profileCard
                ?
                    <Box sx={{justifySelf: 'center', alignSelf: 'center'}}>{cardObjToSwipeCard(profileCard, setOpenModal, true, true)}</Box>
                :
                    <Alert severity="info" style={{alignSelf: 'center', justifySelf: 'center'}}>Загрузка...</Alert>
            }
        </div>
    )
}
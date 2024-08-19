import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// import Textarea from '@mui/joy/Textarea';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FormHelperText  from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function SignUp({setCurrentPage, loggedIn, setLoggedIn}) {
    useEffect(() => {
        setCurrentPage('sign-in')
    }, [])
    let navigate = useNavigate();

    const [isSearchFriend, setIsSearchFriend] = useState(false);
    const [isSearchLove, setIsSearchLove] = useState(false);
    const [isBoy, setIsBoy] = useState(null);
    const [allHobbies, setAllHobbies] = useState([]);

    function fetchSaveData(fetchingArrName, endPointName, setState) {
        axios.get(`http://127.0.0.1:8000/api/${endPointName}/`)
        .then(response => {
            if (response.status != 200) return
            console.log('resp of fetch', response)
            setState(response.data[fetchingArrName])
        })
        .catch(error => {
            console.error(error)
        })
    }

    useEffect(() => {
        fetchSaveData('hobbies', 'getHobbies', setAllHobbies)
    }, [])

    const hobbiesToIds = (hobbies) => {
        return hobbies?.map(hobby => allHobbies.filter(h => h.name === hobby)[0].id)
    }

    let selectedHobbiesIds = []; // айдишники выбранных хобби
    
    const ReactiveSelect = (label, state, onChange, data, required) => {
        return (
            <FormControl fullWidth style={{marginBottom: 8}} required={required} error={validate && state === '' && required}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={state}
                    label={label}
                    onChange={onChange}
                    children={data.map(dataObj => {
                        return <MenuItem value={dataObj.id}>{dataObj.name}</MenuItem>
                    })}
                />
            </FormControl>
        )
    }

    function useSelectWithFetchedOptions(label, fetchingArrName, required) {
        let [data, setData] = useState([]); // options which are objects with keys 'id' and 'name'
        const [selectedOptionId, setSelectedOptionId] = useState('');

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function onChange(ev) {
            setSelectedOptionId(ev.target.value)
        }

        useEffect(() => {
            axios.get(`http://127.0.0.1:8000/api/get${capitalizeFirstLetter(fetchingArrName)}/`)
            .then(response => {
                if (response.status != 200) return
                setData(response.data[fetchingArrName])
            })
            .catch(error => {
                console.error(error)
            })
        }, [])

        return {
            label: label,
            value: selectedOptionId,
            onChange: onChange,
            data: data,
            required: required
        }
    }

    function useFormInput(label, helperText, pattern, required) {
        const [value, setValue] = useState('');
        const [error, setError] = useState(false);

        function onChange(ev) {
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
            required: required
        }
        // <TextField label="Telegram" variant="standard" value={tgContact} error={tgContactError} onChange={(ev) => {setTgContact(ev.target.value); setTgContactError(!ev.target.validity.valid)}} helperText={tgContactError && 'Ссылка на телеграм должна начинаться с https://t.me/'} inputProps={{pattern: "^https?://t.me/"}} />
    }

    // const [vkContact, setVkContact] = useState('');
    // const [tgContact, setTgContact] = useState('');

    const [validate, setValidate] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const vkInputProps = useFormInput('ВКонтакте', 'Ссылка на профиль ВКонтакте должна начинаться с https://vk.com/', 'https://vk.com/.*');
    const tgInputProps = useFormInput('Telegram', 'Ссылка на профиль Телеграм должна начинаться с https://t.me/', 'https://t.me/.*');
    const emailInputProps = useFormInput('Эл. почта', 'Введите действительный адрес электронной почты по типу example@mail.com', "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", 1);
    const passwordInputProps = useFormInput('Пароль', 'Пароль должен содержать от 8 до 50 символов, среди которых есть только латинские символы (минимум одна заглавная и строчная буквы), минимум одна цифра (0-9) и минимум один символ из набора: !@#$%^&*_=+-', "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*_=\\+\\-]).{8,50}$", 1);
    const firstNameInputProps = useFormInput('Имя', 'Имя должно содержать от 1 до 50 символов', ".{1,50}", 1);
    const lastNameInputProps = useFormInput('Фамилия', 'Фамилия должна содержать от 1 до 50 символов', ".{1,50}", 1);
    const descriptionInputProps = useFormInput('О себе', 'Поле "О себе" должно содержать от 1 до 170 символов', ".{1,170}", 1);
    
    const [policyAgreement, setPolicyAgreement] = useState(false);
    const [ageConfirmation, setAgeConfirmation] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmitForm = (ev) => {
        ev.preventDefault();
        setValidate(true);
        const formIsValid =
               !emailInputProps.error
            && !passwordInputProps.error
            && !firstNameInputProps.error
            && !lastNameInputProps.error
            && !descriptionInputProps.error
            && !vkInputProps.error
            && !tgInputProps.error
            && (vkInputProps.value !== '' || tgInputProps.value !== '')
            && courseParams.value != ''
            && buildingParams.value != ''
            && departmentParams.value != ''
            && (isSearchFriend || isSearchLove)
            && (selectedHobbiesIds != undefined)
            && isBoy != null
            && policyAgreement
            && ageConfirmation;
        const data = {
            username: emailInputProps.value,
            email: emailInputProps.value,
            password: passwordInputProps.value,
            first_name: firstNameInputProps.value,
            last_name: lastNameInputProps.value,
            description: descriptionInputProps.value,
            course: courseParams.value,
            building: buildingParams.value,
            department: departmentParams.value,
            is_search_friend: isSearchFriend,
            is_search_love: isSearchLove,
            vk_contact: vkInputProps.value,
            tg_contact: tgInputProps.value,
            hobbies: selectedHobbiesIds,
            is_boy: isBoy
        };
        if (formIsValid) {
            setValidationError(false);
            //console.log(data)
            axios.post('http://127.0.0.1:8000/api/registration/', data)
            .then(response => {
                if (response.status != 201) return
                console.log('resp',response)
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                setLoggedIn(true);
                navigate('/swipe');
                /*
                201 создан аккаунт
                502 ошибка данных: не прошли валидацию
                */
            })
            .catch(error => console.error(error))
        } else {
            console.error('Form is not valid')
            //console.log(data)
            setValidationError(true);
            setTimeout(() => {
                setValidationError(false);
            }, validationErrorMessage.length / (150*6/60/1000))
        }
    }

    /*
    TODO:
        валидация: обязательно заполнение хотя бы одной соц.сети
        реализовать загрузку фотографии
    */

    const buildingParams = useSelectWithFetchedOptions('Корпус', 'buildings', 1)
    const departmentParams = useSelectWithFetchedOptions('Отделение', 'departments', 1)
    const courseParams = useSelectWithFetchedOptions('Курс', 'courses', 1)

    const [searchIntentionError, setSearchIntentionError] = useState(false);

    useEffect(() => {
        setSearchIntentionError(isSearchFriend + isSearchLove == 0)
    }, [isSearchFriend, isSearchLove])

    const theme = useTheme();

    const validationErrorMessage = 'Ого, что-то пошло не так! Похоже, форма запуталась. Проверьте, все ли поля заполнены правильно, и попробуйте снова.';

    return (
        <Box className="wallpaperBackground" style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form style={{width: 'clamp(300px, 90vw, 500px)',}} onSubmit={handleSubmitForm} noValidate>
            {validationError && <Alert severity="error" style={{width: 'inherit', position: 'absolute', zIndex: 300}}>{validationErrorMessage}</Alert>}
                <Card sx={{width: 'clamp(300px, 90vw, 500px)', height: 'fit-content', minHeight: '100px', maxHeight: 'calc(90vh - 56px)', overflow: 'auto', outline: 'none'}} variant="outlined">
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            Регистрация
                        </Typography>
                        <Typography variant="subtitle1">
                            Основная информация
                        </Typography>
                        <Box sx={{display: 'grid', flexDirection: 'column', gap: 1}}>
                            <TextField variant="standard" {...firstNameInputProps} required />
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
                                    value={isBoy}
                                    label="Ваш пол"
                                    onChange={(ev) => setIsBoy(ev.target.value)}
                                    
                                >
                                    <MenuItem value={false}>Женский</MenuItem>
                                    <MenuItem value={true}>Мужской</MenuItem>
                                </Select>
                            </FormControl>
                            <Autocomplete
                                style={{marginBottom: 8}}
                                multiple
                                options={allHobbies}              
                                getOptionLabel={(option) => option.name}
                                // defaultValue={[allHobbies[0]]}
                                renderInput={(params) => {
                                    //setHobbies(hobbiesToIds(params.InputProps.startAdornment?.map(el => el.props['label'])))
                                    selectedHobbiesIds = hobbiesToIds(params.InputProps.startAdornment?.map(el => el.props['label']))
                                    return (
                                        <TextField
                                            {...params}
                                            label="Хобби"
                                            placeholder="Начните печатать..."
                                            required
                                            error={!(selectedHobbiesIds && selectedHobbiesIds.length > 0) && validate}
                                        />
                                    )
                                }}
                            />
                            {[buildingParams, departmentParams, courseParams].map(params => ReactiveSelect(...Object.values(params)))}
                        </Box>
                        <Typography gutterBottom variant="subtitle1" mt={2} color={validate && tgInputProps.value === '' && vkInputProps.value === '' && "error" || tgInputProps.error || vkInputProps.error}>
                            Ссылки на соц. сети для связи
                            <FormHelperText error={validate && tgInputProps.value === '' && vkInputProps.value === '' && true || tgInputProps.error || vkInputProps.error}>Необходимо указать ссылку на хотя бы одну соц. сеть</FormHelperText>
                        </Typography>
                        <Box sx={{display: 'grid', flexDirection: 'column', gap: 1}}>
                            <TextField variant="standard" {...tgInputProps} error={validate && tgInputProps.value === '' && vkInputProps.value === '' && true || tgInputProps.error || vkInputProps.error} />
                            <TextField variant="standard" {...vkInputProps} error={validate && tgInputProps.value === '' && vkInputProps.value === '' && true || tgInputProps.error || vkInputProps.error} />
                        </Box>
                        <Typography gutterBottom variant="subtitle1" mt={2}>
                            Данные для входа
                        </Typography>
                        <Box sx={{display: 'grid', flexDirection: 'column', gap: 1}}>
                            <TextField variant="standard" type="email" {...emailInputProps} required />
                            <TextField variant="standard" type={showPassword ? "text" : "password"} {...passwordInputProps} required
                            InputProps={{ // глазик у поля с паролем
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    //   onMouseDown={() => setShowPassword(prev => !prev)}
                                    >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                                )
                            }} />
                        </Box>
                        <FormGroup style={{marginTop: theme.spacing(2)}}>
                            <FormControlLabel required value={policyAgreement} onChange={() => setPolicyAgreement(prev => !prev)} style={!policyAgreement && validate ? {color: theme.palette.error.main} : {}} control={<Checkbox style={!policyAgreement && validate ? {color: theme.palette.error.main} : {}} />}  label={<span>Я даю свое согласие на обработку моих персональных данных в соответствии с «<Link to="" style={{color: theme.palette.secondary.main}}>Политикой обработки персональных данных</Link>»</span>} />
                            <FormControlLabel required value={ageConfirmation} onChange={() => setAgeConfirmation(prev => !prev)} style={!ageConfirmation && validate ? {color: theme.palette.error.main} : {}} control={<Checkbox style={!ageConfirmation && validate ? {color: theme.palette.error.main} : {}} />} label="Подтверждаю, что мне есть 18 лет" />
                        </FormGroup>
                    </CardContent>
                    
                    <CardActions>
                        <Button size="small" type="submit" formnovalidate>Создать аккаунт</Button>
                        
                    </CardActions>
                </Card>
            </form>

        </Box>
    )
}
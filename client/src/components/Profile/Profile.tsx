import Stack from '@mui/material/Stack';
import { Dispatch, useEffect, useState } from 'react';
import { cardObjToSwipeCard } from '../cardObjToSwipeCard';
import { cardObj, modalStyle } from '../cardObjInterface';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function Profile({setCurrentPage, setOpenModal}: {setCurrentPage: Dispatch<string>, setOpenModal: Dispatch<string>}) {
    const [profileCard, setProfileCard] = useState<cardObj | null>(null);

    function fetchProfile() {
        // fetch profile data from API
        axios.post('http://127.0.0.1:8000/api/getDetailsAboutProfileInMatch/', {
            target_user_id: -1
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(response => console.log('resp in profile:', response))
        .catch(err => console.log('err in profile:', err))
        // set profile data to state
    }
    
    useEffect(() => {
        setCurrentPage('profile')
        fetchProfile()
    }, [])
    
    return (
        <div className="wallpaperBackground" style={{ flexGrow: 1, display: 'grid'}}>
            {
                profileCard ? cardObjToSwipeCard(profileCard, setOpenModal, true) : <Alert severity="info" style={{alignSelf: 'center', justifySelf: 'center'}}>Загрузка...</Alert>
            }
        </div>
    )
}
import { Stack, Alert, Box } from '@mui/material';
import { Dispatch, useEffect, useState } from 'react';
import { cardObjToSwipeCard } from '../cardObjToSwipeCard';
import { cardObj, modalStyle } from '../cardObjInterface';
import axios from 'axios';

export default function Profile({setCurrentPage, setOpenModal}: {setCurrentPage: Dispatch<string>, setOpenModal: Dispatch<string>}) {
    const [profileCard, setProfileCard] = useState<cardObj | null>(null);

    function fetchProfile() {
        // fetch profile data from API
        axios.get('/api/getProfileData/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(response => {
            console.log('resp in profile:', response)
            setProfileCard(response.data.user_data)
        })
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
                profileCard
                ?
                    <Box sx={{justifySelf: 'center', alignSelf: 'center'}}>{cardObjToSwipeCard(profileCard, setOpenModal, true, true)}</Box>
                :
                    <Alert severity="info" style={{alignSelf: 'center', justifySelf: 'center'}}>Загрузка...</Alert>
            }
        </div>
    )
}
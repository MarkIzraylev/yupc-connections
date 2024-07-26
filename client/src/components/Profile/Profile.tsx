import Stack from '@mui/material/Stack';
import { Dispatch, useEffect } from 'react';

export default function Profile({setCurrentPage}: {setCurrentPage: Dispatch<string>}) {
    useEffect(() => {
        setCurrentPage('profile')
    }, [])
    
    return (
        <div style={{ flexGrow: 1}}>
            Profile
        </div>
    )
}
import {Modal, Box, Typography, FormControl, InputLabel, Select, Button } from '@mui/material';
import { modalStyle } from './cardObjInterface';
import axios from 'axios';
import {useState} from 'react';
import { useSelectWithFetchedOptions, ReactiveSelect } from './useSelectWithFetchedOptions';

export default function ComplaintModal({targetId, openModal, setOpenModal, performSwipe}) {
    const complaintSelectProps = useSelectWithFetchedOptions('Причина жалобы', 'complaints', 1);
    const [validate, setValidate] = useState(false);

    function complain() {
        setValidate(true);
        let isValid = complaintSelectProps.value != '';
        if (isValid) {
            // send complaint
            axios.post('/api/sendReport/', {
                target_user_id: targetId,
                complaint_id: complaintSelectProps.value
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
            .then(response => {
                performSwipe(false);
                setOpenModal(null);
            })
            .catch(err => {
                console.log(err);
            })
            
        } else {
            console.log('validation error');
        }
    }

    console.log(complaintSelectProps)
    
    return (
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
                        <ReactiveSelect {...complaintSelectProps} validate={validate} />
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120, mt: 2, display: 'flex', justifyContent: 'right' }}>
                    <Button color="inherit" onClick={complain}>Отправить</Button>
                </Box>
            </Box>
        </Modal>
    )
}
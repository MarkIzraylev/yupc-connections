import {Modal, Box, Typography, FormControl, InputLabel, Select, Button } from '@mui/material';
import { modalStyle } from './cardObjInterface';
import axios from 'axios';

export default function ComplaintModal({targetId, openModal, setOpenModal, performSwipe}) {
    function complain() {
        // send complaint
        // ...
        performSwipe(false);
        setOpenModal(null);
    }
    
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
                        Окно находится в процессе разработки. Скоро здесь будет выпадающий список, опции которого будут загружаться по API.
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120, mt: 2, display: 'flex', justifyContent: 'right' }}>
                    <Button color="inherit" onClick={complain}>Отправить</Button>
                </Box>
            </Box>
        </Modal>
    )
}
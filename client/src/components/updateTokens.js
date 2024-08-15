import axios from 'axios';

export const updateTokens = () => {
    axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: localStorage.getitem('refreshToken')})
    .then(response => {
        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
    })
    .catch(error => {
        console.error('Ошибка при обновлении токена:', error);
    })
} 
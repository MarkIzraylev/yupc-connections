import axios from 'axios';

export function updateTokens() {
    return new Promise((resolve, reject) => {
        axios.post('/api/token/refresh/', { refresh: localStorage.getItem('refreshToken')})
        .then(response => {
            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;
            localStorage.setItem('accessToken', newAccessToken)
            localStorage.setItem('refreshToken', newRefreshToken)
            resolve()
        })
        .catch(error => {
            console.error('Ошибка при обновлении токена:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken'); 
            reject()
        })
    });
}
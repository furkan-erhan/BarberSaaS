import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5199',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const credentials = btoa('admin:admin');

        if(config.headers){
            config.headers.Authorization = `Basic ${credentials}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
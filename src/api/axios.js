import axios from 'axios';
const BASE_URL = 'https://kmembership-api.onrender.com';//'http://localhost:3002/'

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
// axiosInstance.js | rw 25-05-01
// [설명] 공통 axios 인스턴스를 생성하여 모든 요청에 baseURL 및 토큰 자동 부착

import axios from 'axios';
import { getToken } from '../utils/tokenUtil';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터: 토큰 자동 추가
instance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
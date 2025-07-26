// API URL Configuration
const API_URL = 'https://ai-scheduler-pul8.onrender.com';

export const getApiUrl = (endpoint) => {
    return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default {
    API_URL,
    getApiUrl
}; 
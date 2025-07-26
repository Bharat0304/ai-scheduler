// API URL Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://ai-scheduler-backend-two.vercel.app';

export const getApiUrl = (endpoint) => {
    return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default {
    API_URL,
    getApiUrl
}; 
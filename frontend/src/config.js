// API URL Configuration
const API_URL = 'https://ai-scheduler-pul8.onrender.com';
const FRONTEND_URL = 'https://ai-scheduler-1ji937cvg-bharat-s-projects-3e1e346b.vercel.app';

export const getApiUrl = (endpoint) => {
    return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
export { FRONTEND_URL };

export default {
    API_URL,
    getApiUrl
}; 
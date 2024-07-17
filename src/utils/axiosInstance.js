import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const instance = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add token to headers
instance.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh logic
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response) {
            // If error status is 403 (Forbidden), try to refresh the token
            if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = await AsyncStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('No refresh token available');

                    const response = await axios.post(`${API_URL}/api/auth/refresh-token`, { token: refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Store new tokens
                    await AsyncStorage.setItem('accessToken', accessToken);
                    await AsyncStorage.setItem('refreshToken', newRefreshToken);

                    // Update original request's authorization header
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    console.error('Failed to refresh access token:', refreshError);
                    // Remove tokens if refresh failed
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    // Redirect to login or notify user
                    // You can add your logic here, for example:
                    // window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        } else if (error.request) {
            // Network or other error occurred
            console.error('Network error:', error.message);
        } else {
            // General error occurred
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;

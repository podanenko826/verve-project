import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const AxiosInterceptor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [isAttached, setIsAttached] = useState(false);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            async (config) => {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE
                        }
                    });
                    console.log('Intercepting request, token is:', token ? token.substring(0, 15) + '...' : 'NULL');
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.warn('Error fetching token for API request:', error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        setIsAttached(true);

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, [getAccessTokenSilently]);

    if (!isAttached) return null;

    return <>{children}</>;
};

export default AxiosInterceptor;

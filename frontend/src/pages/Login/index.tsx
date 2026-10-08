import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        window.location.replace('/');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative z-10 p-12 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center text-center">
                <h1 className="text-5xl font-semibold mb-4 tracking-tight text-neutral-900 dark:text-white">
                    Verve
                </h1>
                <p className="text-lg mb-10 text-neutral-700 dark:text-white/80">
                    Your premium event management platform.
                </p>
                
                <button
                    onClick={() => loginWithRedirect({ appState: { returnTo: '/' } })}
                    className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl text-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                    Log In to Continue
                </button>
            </div>
        </div>
    );
};

export default Login;

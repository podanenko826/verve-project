import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthMiddleware = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect unauthorized users to the landing page as requested
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthMiddleware;

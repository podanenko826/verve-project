import { useState } from 'react';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import { MdEmail } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';

export default function SettingsPage() {
    const { user } = useAuth0();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        
        setStatus('loading');
        try {
            const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/change_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
                    email: user.email,
                    connection: 'Username-Password-Authentication',
                }),
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <>
            <div className="flex w-full albertsans min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="hidden md:block h-full">
                    <SideBar />
                </div>
                <div className="flex flex-col w-full">
                    <NavBar />
                    <div className="flex flex-col px-8 md:px-16 pb-16">
                        <h1 className="text-4xl self-start font-bold text-gray-800 dark:text-gray-100 mb-10">Settings</h1>

                        <div className="flex flex-col w-full max-w-3xl rounded-3xl border border-gray-200 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden transition-all duration-300">
                            <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Security</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account security and authentication methods.</p>
                            </div>
                            
                            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex flex-col max-w-sm">
                                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Password</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                        {!user?.sub?.startsWith('auth0|') 
                                            ? "Your account uses a social login provider (like Google). Please manage your password directly through your provider." 
                                            : <>You can request a password reset email. This will send a secure link to <span className="font-medium text-gray-700 dark:text-gray-300">{user?.email}</span> to set up a new password.</>}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 flex items-center md:justify-end justify-start">
                                    {!user?.sub?.startsWith('auth0|') ? (
                                        <div className="flex items-center space-x-2 text-slate-500 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <span className="font-medium">Managed by Provider</span>
                                        </div>
                                    ) : status === 'success' ? (
                                        <div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-2xl border border-green-100 dark:border-green-800/30">
                                            <FaCheckCircle className="text-xl" />
                                            <span className="font-medium">Email Sent!</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handlePasswordReset}
                                            disabled={status === 'loading'}
                                            className="flex items-center space-x-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <MdEmail className="text-xl opacity-90" />
                                            <span>
                                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {status === 'error' && (
                                <div className="px-8 pb-8 text-sm text-red-500 font-medium animate-pulse">
                                    Failed to send password reset email. Please try again later.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

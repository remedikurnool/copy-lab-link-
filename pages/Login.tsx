import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { api } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginB2B } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect location or default to profile
  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        const response = await api.login(email, password);

        if (response.token) {
            // 1. Store Token as per requirement
            localStorage.setItem("lablink_token", response.token);
            localStorage.setItem("lablink_user", JSON.stringify(response));

            // 2. Update Zustand Store
            loginB2B({
                id: response.user_id || '0', 
                name: response.user_display_name || email, 
                email: response.user_email || email,
                token: response.token,
                role: 'partner',
                organization: 'Partner'
            });

            // 3. Navigate
            navigate(from, { replace: true });
        } else {
            setError(response.message || 'Login failed. Please check your credentials.');
        }
    } catch (err) {
        setError('An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="shrink-0 p-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl filled-icon">business_center</span>
            </div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">Partner Login</h1>
            <p className="text-gray-500 dark:text-gray-400">Secure access for Lab Link B2B Partners</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Username / Email</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">person</span>
                    <input 
                        type="text" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter username"
                        className="w-full bg-white dark:bg-surface-dark border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder:text-gray-300"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">lock</span>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-surface-dark border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder:text-gray-300"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-text-main dark:bg-white text-white dark:text-text-main font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {isLoading ? (
                    <>
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Logging in...
                    </>
                ) : (
                    'Login'
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
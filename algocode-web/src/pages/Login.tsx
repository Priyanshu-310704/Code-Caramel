import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:3004/api/v1/user/auth/login', { email, password });
            if (res.data.token) {
                login(res.data.token);
                navigate('/');
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[var(--color-cc-bg)] text-[var(--color-cc-text)] p-4">
            <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-[var(--color-cc-border)] shadow-xl flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-gradient drop-shadow-md text-center">Log In</h2>
                <p className="text-[var(--color-cc-text-muted)] mb-8 text-center text-lg">
                    Welcome back to Code Caramel!
                </p>

                {error && (
                    <div className="alert alert-error mb-4 shadow-sm w-full py-2">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="w-full space-y-4 mb-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-[var(--color-cc-text)]">Email Address</span></label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full bg-[var(--color-cc-card)] border-[var(--color-cc-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cc-primary)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-[var(--color-cc-text)]">Password</span></label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full bg-[var(--color-cc-card)] border-[var(--color-cc-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cc-primary)]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="btn w-full bg-[var(--color-cc-primary)] hover:bg-[var(--color-cc-primary)]/90 text-[var(--color-cc-bg)] border-none shrink-0 cursor-pointer text-lg h-12 mt-2">
                        {isLoading ? <span className="loading loading-spinner text-white"></span> : 'Log In'}
                    </button>
                </form>

                <p className="text-[var(--color-cc-text-muted)] text-sm mb-4">
                    Don't have an account? <Link to="/register" className="text-[var(--color-cc-primary)] font-semibold hover:underline">Sign Up</Link>
                </p>

                <div className="divider text-[var(--color-cc-text-muted)] font-medium before:bg-[var(--color-cc-border)] after:bg-[var(--color-cc-border)] w-full mb-6">OR</div>

                <div className="w-full flex justify-center hover:scale-[1.02] transition-transform duration-200">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                login(credentialResponse.credential);
                                navigate('/');
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        size="large"
                        theme="filled_black"
                        shape="rectangular"
                        text="continue_with"
                    />
                </div>
            </div>
        </div>
    );
}

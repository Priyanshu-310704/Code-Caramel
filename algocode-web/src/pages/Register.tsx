import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:3004/api/v1/user/auth/signup', { name, email, password });
            // Signup successful, redirect to Login
            navigate('/login');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[var(--color-cc-bg)] text-[var(--color-cc-text)] p-4">
            <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-[var(--color-cc-border)] shadow-xl flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-gradient drop-shadow-md text-center">Sign Up</h2>
                <p className="text-[var(--color-cc-text-muted)] mb-8 text-center text-lg">
                    Create an account to track your progress and solve challenges.
                </p>

                {error && (
                    <div className="alert alert-error mb-4 shadow-sm w-full py-2">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="w-full space-y-4 mb-6">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-semibold text-[var(--color-cc-text)]">Full Name</span></label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full bg-[var(--color-cc-card)] border-[var(--color-cc-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cc-primary)]"
                            placeholder="John Doe"
                        />
                    </div>
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
                    <button type="submit" disabled={isLoading} className="btn w-full bg-[var(--color-cc-primary)] hover:bg-[var(--color-cc-primary)]/90 text-white border-none shrink-0 cursor-pointer text-lg h-12 mt-4">
                        {isLoading ? <span className="loading loading-spinner text-white"></span> : 'Create Account'}
                    </button>
                </form>

                <p className="text-[var(--color-cc-text-muted)]">
                    Already have an account? <Link to="/login" className="text-[var(--color-cc-primary)] font-semibold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}

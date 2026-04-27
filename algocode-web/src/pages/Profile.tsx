import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
    const { user } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [gender, setGender] = useState(user?.gender || 'Prefer not to say');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3004/api/v1/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setName(res.data.name);
                setGender(res.data.gender || 'Prefer not to say');
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsFetching(false);
            }
        };

        if (user) {
            fetchProfile();
        } else {
            setIsFetching(false);
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3004/api/v1/user/profile',
                { name, gender },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            
            // Re-login to update the context with the new token payload if we want, 
            // but since the token isn't re-issued by PUT, we just rely on local state.
            // Wait, actually our backend doesn't re-issue a token on PUT profile. 
            // That's fine, the token is mostly for ID.
        } catch (err: any) {
            setMessage({ text: err?.response?.data?.error || 'Failed to update profile', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="loading loading-ring loading-lg text-[var(--color-cc-primary)]"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <UserCircle className="w-16 h-16 text-[var(--color-cc-text-muted)]" />
                <h2 className="text-2xl font-semibold">Please log in to view your profile.</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl h-full flex flex-col pt-12 animate-fade-in relative">
            <div className="glow-blob bg-[var(--color-cc-primary)] w-96 h-96 top-0 left-0"></div>
            <div className="glow-blob bg-[var(--color-cc-secondary)] w-96 h-96 bottom-0 right-0 animate-float-delayed"></div>
            
            <h1 className="text-4xl font-extrabold mb-8 text-gradient drop-shadow-md z-10">User Profile</h1>

            <div className="flex flex-col md:flex-row gap-8 z-10">
                {/* Profile Card */}
                <div className="glass-card p-8 flex flex-col items-center flex-shrink-0 md:w-1/3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cc-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="avatar mb-6 relative">
                        <div className="w-32 rounded-full ring ring-[var(--color-cc-primary)] ring-offset-[var(--color-cc-bg)] ring-offset-4 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                            <img src={user.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1 text-center">{name}</h2>
                    <div className="badge badge-outline border-[var(--color-cc-primary)] text-[var(--color-cc-primary)] mb-4 font-semibold">
                        {gender}
                    </div>
                    <p className="text-[var(--color-cc-text-muted)] flex items-center gap-2 text-sm mt-4 bg-[var(--color-cc-bg)]/50 px-4 py-2 rounded-full border border-[var(--color-cc-border)]">
                        <Mail className="w-4 h-4" /> {user.email}
                    </p>
                    <p className="text-green-500 flex items-center gap-2 text-sm mt-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 font-medium">
                        <ShieldCheck className="w-4 h-4" /> Verified User
                    </p>
                </div>

                {/* Settings Form */}
                <div className="glass-card p-8 flex-1">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3 border-b border-[var(--color-cc-border)] pb-4">
                        <UserIcon className="text-[var(--color-cc-primary)]" /> Profile Settings
                    </h3>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success bg-green-500/20 text-green-400 border-green-500/30' : 'alert-error bg-red-500/20 text-red-400 border-red-500/30'} mb-6 shadow-sm`}>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold text-[var(--color-cc-text)] text-lg">Full Name</span></label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input input-lg input-bordered w-full bg-[var(--color-cc-bg)]/50 border-[var(--color-cc-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cc-primary)] transition-shadow"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label"><span className="label-text font-semibold text-[var(--color-cc-text)] text-lg">Gender</span></label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                className="select select-lg select-bordered w-full bg-[var(--color-cc-bg)]/50 border-[var(--color-cc-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cc-primary)] transition-shadow"
                            >
                                <option value="Prefer not to say">Prefer not to say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="pt-4 border-t border-[var(--color-cc-border)]">
                            <button type="submit" disabled={isLoading} className="btn btn-lg w-full sm:w-auto px-10 bg-[var(--color-cc-primary)] hover:bg-[var(--color-cc-primary)]/90 text-white border-none shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all duration-200">
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

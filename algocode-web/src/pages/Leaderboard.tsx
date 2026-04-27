import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Activity } from 'lucide-react';
import axios from 'axios';
import { problemServiceApi } from '../lib/axios';

interface LeaderboardEntry {
    userId: string;
    score: number;
}

interface UserDetails {
    name: string;
    picture: string;
    gender?: string;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [usersMap, setUsersMap] = useState<Record<string, UserDetails>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // 1. Fetch ranking from Submission Service
                const subRes = await problemServiceApi.get('http://localhost:3002/api/v1/submissions/leaderboard');
                const rankingData = subRes.data.data || [];
                setEntries(rankingData);

                // 2. Extract unique user IDs
                const userIds = rankingData.map((r: any) => r.userId);

                // 3. Fetch user details from User Service if we have users
                if (userIds.length > 0) {
                    const userRes = await axios.post('http://localhost:3004/api/v1/user/profile/bulk', { userIds });
                    setUsersMap(userRes.data || {});
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]" />;
        if (index === 2) return <Award className="w-6 h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />;
        return <span className="text-[var(--color-cc-text-muted)] font-bold text-lg w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="min-h-full w-full bg-[var(--color-cc-bg)] text-[var(--color-cc-text)] p-4 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto pt-8 pb-20 relative">
                
                {/* Background Glows */}
                <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none z-0">
                    <div className="glow-blob bg-yellow-500 w-[500px] h-[500px] top-[0%] left-[50%] -translate-x-1/2 opacity-20"></div>
                </div>

                <div className="text-center mb-12 relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-medium text-sm mb-4 backdrop-blur-sm flex items-center gap-2 mx-auto w-max">
                        <Activity className="w-4 h-4" /> Real-time Global Rankings
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md">Global Leaderboard</h1>
                    <p className="text-[var(--color-cc-text-muted)] max-w-2xl mx-auto">
                        Compete with developers worldwide. Solve problems to climb the ranks and showcase your algorithmic mastery.
                    </p>
                </div>

                <div className="glass-card overflow-hidden relative z-10 border-yellow-500/20">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-20">
                            <span className="loading loading-spinner loading-lg text-yellow-500"></span>
                        </div>
                    ) : (
                        <table className="table w-full">
                            <thead className="bg-black/20 text-[var(--color-cc-text-muted)] border-b border-[var(--color-cc-border)]">
                                <tr>
                                    <th className="w-20 text-center text-sm font-semibold py-4">Rank</th>
                                    <th className="text-sm font-semibold py-4">Developer</th>
                                    <th className="w-32 text-center text-sm font-semibold py-4">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-16 text-[var(--color-cc-text-muted)]">
                                            No one has solved any problems yet. Be the first!
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry, index) => {
                                        const user = usersMap[entry.userId];
                                        return (
                                            <tr key={entry.userId} className={`border-b border-[var(--color-cc-border)] hover:bg-white/5 transition-colors ${index < 3 ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' : ''}`}>
                                                <td className="text-center">
                                                    <div className="flex justify-center">
                                                        {getRankIcon(index)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-4 py-2">
                                                        <div className="avatar">
                                                            <div className={`w-12 h-12 rounded-full ${index === 0 ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-[var(--color-cc-bg)]' : ''} ${index === 1 ? 'ring-2 ring-gray-300 ring-offset-2 ring-offset-[var(--color-cc-bg)]' : ''} ${index === 2 ? 'ring-2 ring-amber-600 ring-offset-2 ring-offset-[var(--color-cc-bg)]' : ''}`}>
                                                                <img src={user?.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + entry.userId} alt="Avatar" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-lg text-white">
                                                                {user?.name || "Anonymous Coder"}
                                                            </div>
                                                            {user?.gender && user.gender !== 'Prefer not to say' && (
                                                                <div className="text-xs text-[var(--color-cc-text-muted)]">
                                                                    {user.gender}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                                        {entry.score}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
}

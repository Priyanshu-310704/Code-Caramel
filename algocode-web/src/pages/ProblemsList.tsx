import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemServiceApi } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

export interface Problem {
  _id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await problemServiceApi.get('/problems');
        setProblems(res.data.data || []);
      } catch (err) {
        setError('Failed to load problems. Is the backend running?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubmissions = async () => {
      if (!user?.sub) return;
      try {
        const res = await problemServiceApi.get(`http://localhost:3002/api/v1/submissions/user/${user.sub}`);
        const userSubmissions = res.data.data || [];
        const completed: Record<string, boolean> = {};
        userSubmissions.forEach((sub: any) => {
          if (sub.status === 'Success') {
            completed[sub.problemId] = true;
          }
        });
        setSubmissions(completed);
      } catch (err) {
        console.error('Failed to load submissions', err);
      }
    };

    fetchProblems();
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-success';
      case 'MEDIUM': return 'text-warning';
      case 'HARD': return 'text-error';
      default: return 'text-base-content';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-cc-text)]">Problems</h1>
          <p className="text-[var(--color-cc-text-muted)] mt-1">Select a challenge to start coding.</p>
        </div>
        <Link to="/add-problem" className="px-5 py-2.5 rounded-lg bg-[var(--color-cc-primary)] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-transform">
          Create New Problem
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md mb-6">
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner leading-lg text-[var(--color-cc-primary)]"></span>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="table w-full text-[var(--color-cc-text)]">
            <thead className="bg-black/10 text-[var(--color-cc-text-muted)] border-b border-[var(--color-cc-border)] font-semibold text-sm">
              <tr>
                <th className="rounded-tl-box font-semibold w-16 text-center">Status</th>
                <th className="font-semibold">Title</th>
                <th className="font-semibold w-32">Difficulty</th>
                <th className="rounded-tr-box font-semibold w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.length === 0 && !error ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[var(--color-cc-text-muted)]">
                    No problems found. Did you seed the database?
                  </td>
                </tr>
              ) : (
                problems.map((problem) => (
                  <tr key={problem._id} className="border-b border-[var(--color-cc-border)] hover:bg-black/5 transition duration-150">
                    <td className="text-center">
                      <div className={`w-6 h-6 rounded-full border mx-auto flex items-center justify-center ${submissions[problem._id] ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'border-[var(--color-cc-border)]'}`}>
                        {submissions[problem._id] && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </div>
                    </td>
                    <td className="font-semibold text-lg">
                      <Link to={`/problems/${problem._id}`} className="hover:text-[var(--color-cc-primary)] transition-colors">
                        {problem.title}
                      </Link>
                    </td>
                    <td className={`font-bold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td className="text-center">
                      <Link to={`/problems/${problem._id}`} className="px-4 py-2 rounded-lg bg-[var(--color-cc-primary)] text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform inline-block">
                        Solve
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

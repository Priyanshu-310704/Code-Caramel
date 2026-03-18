import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemServiceApi } from '../lib/axios';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sheet?: string;
}

export default function Sheets() {
  const [groupedProblems, setGroupedProblems] = useState<Record<string, Problem[]>>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTag, setActiveTag] = useState<string>('All');

  // We need to keep a static map or simple logic for tags. Let's just use simple mock logic since the exact mapping isn't heavily seeded.
  const tagMapping: Record<string, string[]> = {
    'All': [], // Shows all
    'Company Wise': ['Company Specific - Google', 'LeetCode Top 100'],
    'Popular': ['LeetCode Top 100', 'Blind 75'],
    'Quick Revision': ['Blind 75', 'Codeforces Basics', 'Top 50 Array Problems'],
    'Complete DSA': ['Dynamic Programming Masterclass', 'Graph Theory Algorithms', 'LeetCode Top 100']
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await problemServiceApi.get('/problems');
        const problems: Problem[] = res.data.data || [];
        
        // Group by sheet
        const grouped = problems.reduce((acc, problem) => {
          const sheetName = problem.sheet || 'Uncategorized';
          if (!acc[sheetName]) {
            acc[sheetName] = [];
          }
          acc[sheetName].push(problem);
          return acc;
        }, {} as Record<string, Problem[]>);
        
        setGroupedProblems(grouped);
      } catch (err) {
        setError('Failed to load sheets. Is the backend running?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HARD': return 'text-red-500';
      default: return 'text-[var(--color-cc-text)]';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12 w-full h-full bg-[var(--color-cc-bg)]">
        <span className="loading loading-spinner leading-lg text-[var(--color-cc-primary)]"></span>
      </div>
    );
  }

  // View: Problem List for a specific Sheet
  if (selectedSheet) {
    const problems = groupedProblems[selectedSheet] || [];
    return (
      <div className="max-w-6xl mx-auto p-8 overflow-y-auto bg-[var(--color-cc-bg)] h-full text-[var(--color-cc-text)]">
        <button 
          onClick={() => setSelectedSheet(null)}
          className="mb-6 flex items-center gap-2 text-[var(--color-cc-text-muted)] hover:text-[var(--color-cc-primary)] font-medium transition"
        >
          &larr; Back to Sheets
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{selectedSheet}</h1>
          <p className="text-[var(--color-cc-text-muted)] mt-1">{problems.length} questions</p>
        </div>

        <div className="bg-[var(--color-cc-card)] rounded-xl border border-[var(--color-cc-border)] shadow-xl overflow-hidden glass-card">
          <table className="table w-full text-[var(--color-cc-text)]">
            <thead className="bg-black/10 text-[var(--color-cc-text-muted)] border-b border-[var(--color-cc-border)] font-semibold">
              <tr>
                <th className="w-16 text-center font-bold">#</th>
                <th className="font-bold">Title</th>
                <th className="w-32 font-bold">Difficulty</th>
                <th className="w-24 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id} className="border-b border-[var(--color-cc-border)] hover:bg-black/5 transition duration-150">
                  <td className="text-center font-mono text-[var(--color-cc-text-muted)]">{index + 1}</td>
                  <td className="font-semibold text-lg">
                    <Link to={`/problems/${problem._id}`} className="hover:text-[var(--color-cc-primary)] transition-colors">
                      {problem.title}
                    </Link>
                  </td>
                  <td className={`font-bold ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty.toUpperCase()}
                  </td>
                  <td className="text-center">
                    <Link to={`/problems/${problem._id}`} className="px-4 py-2 rounded-lg bg-[var(--color-cc-primary)] text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform inline-block">
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // View: Sheets Grid (Dashboard)
  return (
    <div className="max-w-7xl mx-auto p-8 overflow-y-auto bg-[var(--color-cc-bg)] h-full text-[var(--color-cc-text)]">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Track Coding Sheets in One Place</h1>
          <p className="text-[var(--color-cc-text-muted)]">Choose from 30+ structured coding paths</p>
        </div>
      </div>

      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search any coding sheet" 
          className="w-full max-w-lg bg-[var(--color-cc-card)] border border-[var(--color-cc-border)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-cc-primary)] transition"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['Company Wise', 'All', 'Popular', 'Quick Revision', 'Complete DSA'].map(tag => (
          <button 
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTag === tag ? 'bg-[var(--color-cc-primary)] text-white font-bold' : 'bg-[var(--color-cc-card)] border border-[var(--color-cc-border)] hover:bg-black/10'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">All Sheets</h2>
      
      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedProblems)
            .filter(([sheetName]) => {
               if (activeTag === 'All') return true;
               return tagMapping[activeTag]?.some(t => sheetName.includes(t)) || tagMapping[activeTag]?.includes(sheetName);
            })
            .map(([sheetName, problems]) => {
            // Mock progression % for visual fidelity
            const mockProgress = Math.floor(Math.random() * 30) + 5; 
            
            return (
              <div 
                key={sheetName} 
                className="bg-[var(--color-cc-card)] border border-[var(--color-cc-border)] rounded-xl p-5 shadow-lg flex flex-col cursor-pointer hover:border-[var(--color-cc-primary)]/50 transition duration-200 group relative overflow-hidden"
                onClick={() => setSelectedSheet(sheetName)}
              >
                {/* Progress Bar Top Margin */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black/10">
                   <div className="h-full bg-[var(--color-cc-primary)]" style={{width: `${mockProgress}%`}}></div>
                </div>

                <div className="flex justify-between items-center mb-4 mt-2">
                   <span className="text-xs text-[var(--color-cc-text-muted)] font-bold">{mockProgress}%</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-cc-primary)] transition line-clamp-1" title={sheetName}>
                  {sheetName}
                </h3>
                
                <p className="text-[var(--color-cc-text-muted)] text-xs mb-6 line-clamp-3">
                  This curated sheet contains the top essential questions for mastering the concepts within {sheetName}. Perfect for interview prep.
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[var(--color-cc-border)] pt-4">
                  <div className="text-sm font-medium text-[var(--color-cc-text-muted)] flex items-center gap-2">
                    <span>📝</span>
                    {problems.length} questions
                  </div>
                  <button className="px-3 py-1 bg-[var(--color-cc-primary)] text-white text-xs font-bold rounded flex items-center gap-1 opacity-90 hover:opacity-100">
                    <span>🔖</span> Follow
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {Object.keys(groupedProblems).length === 0 && !error && !isLoading && (
        <div className="text-center py-12 text-[var(--color-cc-text-muted)] bg-[var(--color-cc-card)] rounded-xl border border-[var(--color-cc-border)]">
          No sheets available.
        </div>
      )}
      
    </div>
  );
}

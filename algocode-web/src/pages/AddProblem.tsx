import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { problemServiceApi } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

export default function AddProblem() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    testCases: [{ input: '', output: '' }],
    codeStubs: [
      { language: 'CPP', startSnippet: '', endSnippet: '', userSnippet: '' },
      { language: 'JAVA', startSnippet: '', endSnippet: '', userSnippet: '' }
    ],
    editorial: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index: number, field: string, value: string) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData({ ...formData, testCases: [...formData.testCases, { input: '', output: '' }] });
  };

  const removeTestCase = (index: number) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleCodeStubChange = (index: number, field: string, value: string) => {
    const newCodeStubs = [...formData.codeStubs];
    newCodeStubs[index] = { ...newCodeStubs[index], [field]: value };
    setFormData({ ...formData, codeStubs: newCodeStubs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await problemServiceApi.post('/problems', formData);
      navigate('/problems');
    } catch (err) {
      setError('Failed to create problem. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Problem</h1>
        <p className="text-base-content/70 mt-1">Add a new challenge to Code Caramel.</p>
      </div>

      {error && (
        <div className="alert alert-error mb-6 shadow-sm">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-base-200 p-6 rounded-box border border-base-300 shadow-xl">
        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Title</span></label>
          <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="input input-bordered w-full" placeholder="e.g. Two Sum" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Difficulty</span></label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="select select-bordered w-full">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Description</span></label>
          <textarea required name="description" value={formData.description} onChange={handleInputChange} className="textarea textarea-bordered h-32" placeholder="Problem description..."></textarea>
        </div>

        <div className="divider">Test Cases</div>
        {formData.testCases.map((tc, index) => (
          <div key={index} className="flex gap-4 items-start bg-base-100 p-4 rounded-lg border border-base-300">
            <div className="flex-1 space-y-2">
              <textarea placeholder="Input" required value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} className="textarea textarea-bordered w-full h-20 font-mono text-sm"></textarea>
            </div>
            <div className="flex-1 space-y-2">
              <textarea placeholder="Expected Output" required value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)} className="textarea textarea-bordered w-full h-20 font-mono text-sm"></textarea>
            </div>
            <button type="button" onClick={() => removeTestCase(index)} className="btn btn-square btn-error btn-sm mt-1" disabled={formData.testCases.length === 1}>✕</button>
          </div>
        ))}
        <button type="button" onClick={addTestCase} className="btn btn-outline btn-sm">Add Test Case</button>

        <div className="divider">Code Stubs</div>
        {formData.codeStubs.map((stub, index) => (
          <div key={index} className="space-y-4 bg-base-100 p-4 rounded-lg border border-base-300">
            <h3 className="font-semibold text-lg">{stub.language}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Start Snippet (Hidden from user)</span></label>
                <textarea value={stub.startSnippet} onChange={(e) => handleCodeStubChange(index, 'startSnippet', e.target.value)} className="textarea textarea-bordered h-24 font-mono text-sm" placeholder="e.g. import statement"></textarea>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">End Snippet (Hidden from user)</span></label>
                <textarea value={stub.endSnippet} onChange={(e) => handleCodeStubChange(index, 'endSnippet', e.target.value)} className="textarea textarea-bordered h-24 font-mono text-sm" placeholder="e.g. driver logic"></textarea>
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">User Snippet (Visible to user)</span></label>
              <textarea value={stub.userSnippet} onChange={(e) => handleCodeStubChange(index, 'userSnippet', e.target.value)} className="textarea textarea-bordered h-32 font-mono text-sm" placeholder="e.g. function solution() { ... }"></textarea>
            </div>
          </div>
        ))}

        <div className="divider"></div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate('/problems')} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : 'Create Problem'}
          </button>
        </div>
      </form>
    </div>
  );
}

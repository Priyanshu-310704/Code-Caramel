import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import Editor from '@monaco-editor/react';
import { Play, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

import { problemServiceApi, submissionServiceApi } from '../lib/axios';
import type { Problem } from './ProblemsList';

interface CodeStub {
  language: string;
  startSnippet: string;
  endSnippet: string;
  userSnippet?: string;
}

interface ProblemDetail extends Problem {
  description: string;
  testCases: Array<{ input: string; output: string }>;
  codeStubs: CodeStub[];
}

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [language, setLanguage] = useState('CPP');
  const [code, setCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useAuth();
  const userId = user?.sub || 'anonymous';

  // Fetch Problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await problemServiceApi.get(`/problems/${id}`);
        const problemData = res.data.data;
        setProblem(problemData);
        if (problemData.codeStubs?.length > 0) {
           const initialStub = problemData.codeStubs[0];
           setLanguage(initialStub.language);
           // Use the actual code stub as the starting point
           setCode(initialStub.userSnippet || '// Write your code here...\n');
        }
      } catch (err) {
        console.error('Failed to load problem', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProblem();
  }, [id]);

  // Setup Socket
  useEffect(() => {
    const socket = io('ws://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('setUserId', userId);
    });

    socket.on('submissionPayloadResponse', (data) => {
      console.log("Received payload response via socket:", data);
      const result = data.response ? data.response : data;
      setSubmissionResult(result);
      setIsSubmitting(false);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const [editorTheme, setEditorTheme] = useState('vs-dark');

  useEffect(() => {
    // Sync theme with document class
    const checkTheme = () => {
      setEditorTheme(document.documentElement.classList.contains('light-mode') ? 'light' : 'vs-dark');
    };
    checkTheme();
    
    // Simple observer for class changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem?.codeStubs) {
      const stub = problem.codeStubs.find(s => s.language === newLang);
      if (stub) setCode(stub.userSnippet || '');
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      await submissionServiceApi.post('/submissions', {
        problemId: id,
        userId: userId,
        code: code,
        language: language
      });
      // Now we wait for the socket response
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
      setSubmissionResult({ status: 'ERROR', error: 'Failed to submit code. Check backend connection.'});
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) return <div className="p-8 text-center text-error font-bold">Problem not found!</div>;

  const sanitizedMarkdown = DOMPurify.sanitize(problem.description || '');

  return (
    <div className="flex h-full w-full">
      {/* Left Pane: Description */}
      <div className="w-1/2 h-full flex flex-col border-r border-base-300 bg-base-100">
        <div className="h-12 bg-base-300 flex border-b border-base-300 items-center px-4 font-semibold shrink-0 gap-3">
          <span className="badge badge-primary badge-sm">Description</span>
          <span>{problem.title}</span>
        </div>
        <div className="flex-1 overflow-auto p-6 prose prose-invert max-w-none">
          <Markdown rehypePlugins={[rehypeRaw]}>{sanitizedMarkdown}</Markdown>
        </div>
      </div>

      {/* Right Pane: Code + Console */}
      <div className="w-1/2 h-full flex flex-col bg-[var(--color-cc-bg)]">
        {/* Editor Toolbar */}
        <div className="h-12 bg-base-300 flex items-center justify-between px-4 shrink-0 text-sm border-b border-base-300">
          <div className="flex items-center gap-4">
            <select 
              className="select select-bordered select-sm bg-base-100 font-mono text-xs w-32"
              value={language}
              onChange={handleLanguageChange}
            >
               {problem.codeStubs?.map(stub => (
                 <option key={stub.language} value={stub.language}>{stub.language}</option>
               ))}
               {!problem.codeStubs?.length && <option value="CPP">CPP</option>}
            </select>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-success' : 'bg-error'}`}></div>
              <span className="text-xs text-base-content/60">Socket</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn btn-sm btn-ghost"
              onClick={submitCode}
              disabled={isSubmitting}
            >
              <Play className="w-4 h-4 text-success" /> Run
            </button>
            <button 
              className="btn btn-sm bg-success/20 text-success hover:bg-success hover:text-success-content border-none"
              onClick={submitCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 shrink-0 h-3/5">
          <Editor
            height="100%"
            language={language.toLowerCase() === 'cpp' ? 'cpp' : language.toLowerCase()}
            theme={editorTheme}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Console / Output Panel */}
        <div className="h-2/5 shrink-0 bg-base-200 border-t border-base-300 flex flex-col">
          <div className="h-10 bg-base-300 flex items-center px-4 text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Console Output
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {!submissionResult && !isSubmitting && (
              <div className="text-base-content/40">Ready. Run code or Submit to view output.</div>
            )}
            
            {isSubmitting && (
              <div className="flex items-center gap-3 text-info">
                <Loader2 className="w-4 h-4 animate-spin" /> Evaluating... Pending worker pipeline...
              </div>
            )}

            {submissionResult && submissionResult.status === 'SUCCESS' && (
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-success font-bold text-lg">
                    <CheckCircle className="w-5 h-5" /> Accepted
                 </div>
                 <div className="p-3 bg-base-300 rounded text-success max-w-lg">
                   Output: {submissionResult.output}
                 </div>
              </div>
            )}

            {submissionResult && submissionResult.status === 'WA' && (
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-error font-bold text-lg">
                    <XCircle className="w-5 h-5" /> Wrong Answer
                 </div>
                 <div className="p-3 bg-base-300 rounded text-error max-w-lg">
                   Output: {submissionResult.output}
                 </div>
              </div>
            )}
            
            {submissionResult && submissionResult.status === 'ERROR' && (
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-error font-bold text-lg">
                    <XCircle className="w-5 h-5" /> Compilation / Execution Error
                 </div>
                 <div className="p-3 bg-base-300 rounded text-error/80 whitespace-pre max-w-full overflow-auto">
                   {submissionResult.error || submissionResult.output}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Play, Code2, Layers, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-[var(--color-cc-bg)] text-[var(--color-cc-text)]">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none z-0">
        <div className="glow-blob bg-orange-600 w-[500px] h-[500px] -top-[20%] -left-[10%] animate-float"></div>
        <div className="glow-blob bg-rose-600 w-[600px] h-[600px] top-[20%] -right-[10%] animate-float-delayed opacity-20"></div>
        <div className="glow-blob bg-yellow-600 w-[400px] h-[400px] -bottom-[10%] left-[20%] animate-float opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24">
        
        {/* Animated Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 mt-12 mb-32">
          
          <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-medium text-sm mb-4 animate-fade-in backdrop-blur-sm">
            ✨ The Ultimate Coding Playground
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-white leading-tight">
            Master Algorithms.<br />
            <span className="text-gradient">Accelerate Your Career.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-cc-text-muted)] max-w-2xl leading-relaxed">
            Experience real-time code execution, curated problem sheets, and seamless learning with Code Caramel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link to="/problems" className="group relative px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transition-all transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Start Solving
              </span>
            </Link>
            
            <Link to="/sheets" className="px-8 py-4 glass-card hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 border-white/20">
              <Layers className="w-5 h-5" />
              Explore Sheets
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {/* Feature 1 */}
          <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 border-white/5 hover:border-orange-500/30">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Live Execution</h3>
            <p className="text-[var(--color-cc-text-muted)] leading-relaxed">
              Write, compile, and run C++ or Java code instantly directly in your browser with our Monaco-powered IDE.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 border-white/5 hover:border-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Curated Sheets</h3>
            <p className="text-[var(--color-cc-text-muted)] leading-relaxed">
              Follow structured paths like 'LeetCode Top 100' or 'Codeforces Basics' to guarantee you learn the right patterns, fast.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 border-white/5 hover:border-yellow-500/30">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Instant Feedback</h3>
            <p className="text-[var(--color-cc-text-muted)] leading-relaxed">
              Every submission is evaluated against rigorous, hidden test cases in real-time, providing immediate correctness feedback.
            </p>
          </div>
        </div>

        {/* Showcase Banner */}
        <div className="glass-card relative overflow-hidden p-12 text-center border-orange-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-500/10"></div>
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold mb-6">Ready to conquer your next interview?</h2>
          <p className="relative z-10 text-lg text-[var(--color-cc-text-muted)] max-w-2xl mx-auto mb-8">
            Join the platform that focuses on raw algorithmic problem-solving without the distractions.
          </p>
          <Link to="/problems" className="relative z-10 inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
            View All Problems &rarr;
          </Link>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md py-8 text-center text-[var(--color-cc-text-muted)] text-sm z-10 relative">
        <p>© 2026 Code Caramel. Built for developers, by developers.</p>
      </footer>
    </div>
  );
}

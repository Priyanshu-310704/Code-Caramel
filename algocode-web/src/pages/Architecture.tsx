import { Database, Server, Cpu, Globe, ArrowRight, Layers, Layout, HardDrive, RefreshCw } from 'lucide-react';

export default function Architecture() {
    return (
        <div className="min-h-full w-full bg-[var(--color-cc-bg)] text-[var(--color-cc-text)] p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto pt-8 pb-20">
                <div className="text-center mb-16 relative">
                    <div className="glow-blob bg-blue-500 w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-20 animate-pulse"></div>
                    <h1 className="text-5xl font-extrabold mb-6 text-gradient drop-shadow-md relative z-10">System Architecture</h1>
                    <p className="text-xl text-[var(--color-cc-text-muted)] max-w-3xl mx-auto relative z-10 leading-relaxed">
                        Code Caramel is built on a highly scalable, distributed microservices architecture designed to handle thousands of concurrent code executions with sub-second latency.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 relative z-10">
                    
                    {/* Frontend */}
                    <div className="col-span-1 lg:col-span-12 flex justify-center mb-4">
                        <div className="glass-card p-6 border-blue-500/30 flex items-center gap-4 w-96 justify-center">
                            <Globe className="w-10 h-10 text-blue-400" />
                            <div>
                                <h3 className="text-xl font-bold">React Frontend</h3>
                                <p className="text-sm text-[var(--color-cc-text-muted)]">Vite, Tailwind, Zustand, Monaco IDE</p>
                            </div>
                        </div>
                    </div>

                    {/* API Gateway (Simulated) */}
                    <div className="col-span-1 lg:col-span-12 flex justify-center flex-col items-center mb-4">
                        <div className="h-12 w-0.5 bg-gradient-to-b from-blue-500/50 to-orange-500/50"></div>
                        <ArrowRight className="w-6 h-6 text-orange-500/50 rotate-90 -mt-2 mb-2" />
                        <div className="glass-card px-8 py-3 border-orange-500/30 bg-orange-500/10 rounded-full font-semibold tracking-widest text-orange-400">
                            HTTP / REST / WEBSOCKETS
                        </div>
                        <div className="h-12 w-0.5 bg-gradient-to-b from-orange-500/50 to-white/20 mt-2"></div>
                        <ArrowRight className="w-6 h-6 text-white/50 rotate-90 -mt-2" />
                    </div>

                    {/* Microservices */}
                    <div className="col-span-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* User Service */}
                        <div className="glass-card p-6 border-white/10 hover:border-[var(--color-cc-primary)]/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Server className="text-purple-400 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">User Service</h3>
                            <p className="text-sm text-[var(--color-cc-text-muted)] mb-4">Handles JWT Auth, Profiles, and Google OAuth.</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/10 py-1 px-2 rounded w-max border border-purple-500/20">
                                <Database className="w-3 h-3" /> MongoDB
                            </div>
                        </div>

                        {/* Problem Service */}
                        <div className="glass-card p-6 border-white/10 hover:border-[var(--color-cc-primary)]/50 transition-colors group">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Layers className="text-emerald-400 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Problem Service</h3>
                            <p className="text-sm text-[var(--color-cc-text-muted)] mb-4">Serves problem descriptions, test cases, and sheets.</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-1 px-2 rounded w-max border border-emerald-500/20">
                                <Database className="w-3 h-3" /> MongoDB
                            </div>
                        </div>

                        {/* Submission Service */}
                        <div className="glass-card p-6 border-white/10 hover:border-[var(--color-cc-primary)]/50 transition-colors group">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Cpu className="text-rose-400 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Submission Service</h3>
                            <p className="text-sm text-[var(--color-cc-text-muted)] mb-4">Produces evaluation jobs to BullMQ.</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 py-1 px-2 rounded w-max border border-rose-500/20">
                                <Database className="w-3 h-3" /> MongoDB
                            </div>
                        </div>

                        {/* Socket Service */}
                        <div className="glass-card p-6 border-white/10 hover:border-[var(--color-cc-primary)]/50 transition-colors group">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <RefreshCw className="text-cyan-400 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Socket Service</h3>
                            <p className="text-sm text-[var(--color-cc-text-muted)] mb-4">Pushes real-time execution results to clients.</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 py-1 px-2 rounded w-max border border-cyan-500/20">
                                <Layout className="w-3 h-3" /> Socket.IO
                            </div>
                        </div>

                    </div>

                    {/* Message Broker */}
                    <div className="col-span-1 lg:col-span-12 flex justify-center flex-col items-center my-6">
                        <div className="h-12 w-0.5 bg-gradient-to-b from-white/20 to-red-500/50"></div>
                        <ArrowRight className="w-6 h-6 text-red-500/50 rotate-90 -mt-2 mb-2" />
                        <div className="glass-card px-10 py-4 border-red-500/40 bg-red-500/10 rounded-2xl flex items-center gap-4">
                            <HardDrive className="w-8 h-8 text-red-400" />
                            <div>
                                <h3 className="text-xl font-bold text-red-400 tracking-wide">Redis & BullMQ</h3>
                                <p className="text-sm text-red-400/70 font-medium">Asynchronous Job Queue & Pub/Sub</p>
                            </div>
                        </div>
                        <div className="h-12 w-0.5 bg-gradient-to-b from-red-500/50 to-[var(--color-cc-secondary)]/50 mt-2"></div>
                        <ArrowRight className="w-6 h-6 text-[var(--color-cc-secondary)]/50 rotate-90 -mt-2" />
                    </div>

                    {/* Evaluation Engine */}
                    <div className="col-span-1 lg:col-span-12 flex justify-center">
                        <div className="glass-card p-8 border-[var(--color-cc-secondary)]/40 w-full max-w-3xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cc-secondary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-[var(--color-cc-secondary)]/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Cpu className="text-[var(--color-cc-secondary)] w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Evaluator Service (Workers)</h3>
                                    <p className="text-[var(--color-cc-text-muted)] leading-relaxed mb-4">
                                        Consumes jobs from BullMQ. Mounts the host Docker socket to spin up ephemeral <strong className="text-white">GCC/G++</strong> or <strong className="text-white">Python</strong> containers. Compiles, runs against hidden test cases, captures output, destroys the container, and emits results to Redis Pub/Sub.
                                    </p>
                                    <div className="flex gap-3 flex-wrap">
                                        <span className="badge badge-outline border-blue-400 text-blue-400">Docker API</span>
                                        <span className="badge badge-outline border-yellow-400 text-yellow-400">Node.js Execution Sandbox</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

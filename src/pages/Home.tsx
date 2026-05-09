import { Link } from 'react-router-dom'
import { Activity, Shield, Cpu, ArrowRight, Camera } from 'lucide-react'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { HeroBlueprint3D } from '../components/HeroBlueprint3D'

export function Home() {
  return (
    <div className="min-h-screen bg-cyber-900 text-white relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-10 glass-panel border-b border-cyber-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-cyber-800 border border-neon-cyan/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-neon-cyan" />
              </div>
              <span className="font-mono font-bold text-xl tracking-wider text-neon-cyan">
                Spectral<span className="text-white"></span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/how-it-works" className="text-cyber-300 hover:text-neon-cyan font-mono text-sm transition-colors">
                HOW IT WORKS
              </Link>
              <Link to="/dashboard" className="cyber-button-primary">
                LAUNCH SYSTEM
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-xs font-mono mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
          </span>
          SYSTEM ONLINE v1.0.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">
            ADVANCED AI
          </span>
          <span className="block mt-2">INSPECTION ENGINE</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-xl text-cyber-300 font-mono">
          Real-time topology analysis, 3D blueprinting, and anomaly detection.
          Deploy military-grade computer vision in seconds.
        </p>

        <div className="mt-10 flex justify-center gap-4 mb-16">
          <Link to="/dashboard" className="cyber-button-primary flex items-center gap-2 text-lg px-8 py-4">
            <Camera className="w-5 h-5" />
            ENTER DASHBOARD
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* 3D Blueprint Simulation */}
        <div className="w-full max-w-5xl mx-auto shadow-[0_0_30px_rgba(0,240,255,0.1)] rounded-xl relative z-20">
          <HeroBlueprint3D />
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-panel p-6 rounded-xl border border-cyber-700/50 hover:border-neon-cyan/50 transition-colors group">
            <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-neon-cyan" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white mb-2">LIVE ANALYSIS</h3>
            <p className="text-cyber-400 text-sm">
              Continuous video stream processing with sub-millisecond anomaly detection using advanced convolutional networks.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-cyber-700/50 hover:border-neon-purple/50 transition-colors group">
            <div className="w-12 h-12 bg-neon-purple/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-neon-purple" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white mb-2">3D BLUEPRINTING</h3>
            <p className="text-cyber-400 text-sm">
              Automatically extrapolate 3D topology from 2D reference images using depth-map generation algorithms.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-cyber-700/50 hover:border-neon-green/50 transition-colors group">
            <div className="w-12 h-12 bg-neon-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-neon-green" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white mb-2">EXTRAVISION™</h3>
            <p className="text-cyber-400 text-sm">
              Deploy our proprietary thermal and edge-detection filters to see what standard optical sensors miss.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

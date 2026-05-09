import { Link } from 'react-router-dom'
import { Activity, Shield, ArrowLeft, Layers } from 'lucide-react'
import { AnimatedBackground } from '../components/AnimatedBackground'

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-cyber-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 glass-panel border-b border-cyber-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-cyber-800 border border-neon-cyan/30 flex items-center justify-center group-hover:border-neon-cyan transition-colors">
                <ArrowLeft className="w-4 h-4 text-neon-cyan" />
              </div>
              <span className="font-mono text-sm tracking-wider text-cyber-300 group-hover:text-white transition-colors">
                BACK TO HUB
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="cyber-button-primary">
                LAUNCH SYSTEM
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 border-b border-cyber-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            SYSTEM ARCHITECTURE
          </h1>
          <p className="text-xl text-cyber-400 font-mono">
            Declassifying the technology behind MidnightMedic's inspection engine.
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1 */}
          <section className="glass-panel p-8 rounded-2xl border border-neon-cyan/20 relative">
            <div className="absolute -top-6 left-8 bg-cyber-900 border border-neon-cyan/50 p-3 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Layers className="w-6 h-6 text-neon-cyan" />
            </div>
            <h2 className="text-2xl font-bold font-mono mt-4 mb-4 text-neon-cyan">01. TOPOLOGY EXTRAPOLATION</h2>
            <p className="text-cyber-300 mb-4">
              When a 2D reference blueprint is uploaded, our engine immediately begins depth-map generation. We utilize advanced displacement mapping algorithms to simulate a 3D structural mesh from flat data.
            </p>
            <ul className="list-disc list-inside text-cyber-400 font-mono text-sm space-y-2">
              <li>High-frequency contrast analysis for edge detection</li>
              <li>WebGL powered vertex extrusion</li>
              <li>Real-time rendering via Three.js and React Three Fiber</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="glass-panel p-8 rounded-2xl border border-neon-purple/20 relative">
            <div className="absolute -top-6 left-8 bg-cyber-900 border border-neon-purple/50 p-3 rounded-xl shadow-[0_0_15px_rgba(176,38,255,0.2)]">
              <Activity className="w-6 h-6 text-neon-purple" />
            </div>
            <h2 className="text-2xl font-bold font-mono mt-4 mb-4 text-neon-purple">02. PIPELINE AGENT PROCESSING</h2>
            <p className="text-cyber-300 mb-4">
              The continuous video feed is intercepted by the Pipeline Agent. This automated daemon handles frame extraction, normalization, and passes the data through our AI evaluation layers without manual intervention.
            </p>
            <ul className="list-disc list-inside text-cyber-400 font-mono text-sm space-y-2">
              <li>Asynchronous frame capture (30fps capable)</li>
              <li>Automated alignment and calibration</li>
              <li>Real-time telemetry and state reporting</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="glass-panel p-8 rounded-2xl border border-neon-green/20 relative">
            <div className="absolute -top-6 left-8 bg-cyber-900 border border-neon-green/50 p-3 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <Shield className="w-6 h-6 text-neon-green" />
            </div>
            <h2 className="text-2xl font-bold font-mono mt-4 mb-4 text-neon-green">03. EXTRAVISION™ ANOMALY DETECTION</h2>
            <p className="text-cyber-300 mb-4">
              Standard RGB comparison is insufficient for structural integrity validation. ExtraVision™ applies specialized visual filters (like edge isolation and synthetic thermal mapping) to the live feed.
            </p>
            <ul className="list-disc list-inside text-cyber-400 font-mono text-sm space-y-2">
              <li>Pixel-perfect difference calculation</li>
              <li>Tolerance-based anomaly highlighting (Neon Red for defects)</li>
              <li>Configurable structural strictness parameters</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

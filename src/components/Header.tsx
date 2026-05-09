import { motion } from 'framer-motion'
import { Activity, Scan, Zap } from 'lucide-react'

interface HeaderProps {
    isInspecting: boolean
    onToggleInspection: () => void
}

export function Header({ isInspecting, onToggleInspection }: HeaderProps) {
    return (
        <header className="relative z-50 glass-panel border-b border-glass-border">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                                <Scan className="w-5 h-5 text-cyber-900" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-white tracking-tight">
                                SpectraVision<span className="text-neon-cyan"> AI</span>
                            </h1>
                            <p className="text-[10px] text-cyber-300 font-mono tracking-widest uppercase">
                                Visual Inspection System
                            </p>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyber-300">
                            <Activity className="w-3.5 h-3.5 text-neon-green" />
                            <span className="text-neon-green">SYSTEM ONLINE</span>
                        </div>
                        <div className="h-4 w-px bg-cyber-600" />
                        <div className="flex items-center gap-2 text-xs font-mono text-cyber-300">
                            <Zap className="w-3.5 h-3.5 text-neon-yellow" />
                            <span>AI ENGINE READY</span>
                        </div>
                    </div>

                    <motion.button
                        onClick={onToggleInspection}
                        className={`relative px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isInspecting
                                ? 'bg-neon-red/20 text-neon-red border border-neon-red/30 hover:bg-neon-red/30'
                                : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isInspecting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
                                Stop Inspection
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Scan className="w-4 h-4" />
                                Start Inspection
                            </span>
                        )}
                    </motion.button>
                </div>
            </div>
        </header>
    )
}

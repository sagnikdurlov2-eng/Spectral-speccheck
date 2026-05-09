import { motion } from 'framer-motion'

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 grid-bg animate-grid-flow opacity-40" />

            {/* Floating orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full opacity-[0.03]"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%)',
                    top: '10%',
                    left: '5%',
                }}
                animate={{
                    y: [0, -30, 0],
                    x: [0, 15, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full opacity-[0.03]"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 128, 255, 0.3) 0%, transparent 70%)',
                    bottom: '10%',
                    right: '10%',
                }}
                animate={{
                    y: [0, 20, 0],
                    x: [0, -20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full opacity-[0.02]"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Scanline effect */}
            <div className="absolute inset-0 scanline opacity-30" />

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-4 left-4 w-8 h-px bg-neon-cyan/20" />
                <div className="absolute top-4 left-4 w-px h-8 bg-neon-cyan/20" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32">
                <div className="absolute top-4 right-4 w-8 h-px bg-neon-cyan/20" />
                <div className="absolute top-4 right-4 w-px h-8 bg-neon-cyan/20" />
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32">
                <div className="absolute bottom-4 left-4 w-8 h-px bg-neon-cyan/20" />
                <div className="absolute bottom-4 left-4 w-px h-8 bg-neon-cyan/20" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-4 right-4 w-8 h-px bg-neon-cyan/20" />
                <div className="absolute bottom-4 right-4 w-px h-8 bg-neon-cyan/20" />
            </div>
        </div>
    )
}

import { motion } from 'framer-motion'
import { Box } from 'lucide-react'
import { Blueprint3D } from './Blueprint3D'

interface SimulationPanelProps {
    referenceImage: HTMLImageElement | null
}

export function SimulationPanel({ referenceImage }: SimulationPanelProps) {
    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="px-4 py-3 border-b border-glass-border flex items-center gap-2">
                <Box className="w-4 h-4 text-neon-purple" />
                <h2 className="text-sm font-semibold text-white">3D Extrusion</h2>
            </div>
            <div className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-cyber-800">
                    <Blueprint3D image={referenceImage} />
                </div>
            </div>
        </motion.div>
    )
}

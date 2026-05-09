import { motion, AnimatePresence } from 'framer-motion'
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info, ChevronRight } from 'lucide-react'
import type { DetectedDefect, Severity } from '../types'

interface DefectListProps {
    defects: DetectedDefect[]
    isInspecting: boolean
}

const severityConfig: Record<Severity, { icon: any; color: string; bg: string; border: string }> = {
    critical: {
        icon: AlertCircle,
        color: 'text-neon-red',
        bg: 'bg-neon-red/10',
        border: 'border-neon-red/20',
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-neon-yellow',
        bg: 'bg-neon-yellow/10',
        border: 'border-neon-yellow/20',
    },
    info: {
        icon: Info,
        color: 'text-neon-cyan',
        bg: 'bg-neon-cyan/10',
        border: 'border-neon-cyan/20',
    },
}

const typeLabels: Record<string, string> = {
    alignment: 'Alignment',
    missing_component: 'Missing Component',
    spacing: 'Spacing',
    layout: 'Layout',
    color: 'Color',
}

export function DefectList({ defects, isInspecting }: DefectListProps) {
    const criticalCount = defects.filter((d) => d.severity === 'critical').length
    const warningCount = defects.filter((d) => d.severity === 'warning').length
    const infoCount = defects.filter((d) => d.severity === 'info').length

    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="px-4 py-3 border-b border-glass-border">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Detected Defects</h2>
                    {defects.length > 0 && (
                        <div className="flex items-center gap-2">
                            {criticalCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neon-red/20 text-neon-red">
                                    {criticalCount} critical
                                </span>
                            )}
                            {warningCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neon-yellow/20 text-neon-yellow">
                                    {warningCount} warning
                                </span>
                            )}
                            {infoCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neon-cyan/20 text-neon-cyan">
                                    {infoCount} info
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                    {defects.length > 0 ? (
                        <div className="divide-y divide-glass-border">
                            {defects.map((defect, index) => {
                                const config = severityConfig[defect.severity]
                                const Icon = config.icon
                                return (
                                    <motion.div
                                        key={`${defect.type}-${defect.x}-${defect.y}-${index}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`px-4 py-3 hover:bg-glass-hover transition-colors cursor-pointer`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1 rounded ${config.bg} ${config.border} border`}>
                                                <Icon className={`w-3 h-3 ${config.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`text-xs font-medium ${config.color}`}>
                                                        {typeLabels[defect.type] ?? defect.type}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-cyber-400 uppercase">
                                                        {defect.severity}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-cyber-300 leading-relaxed">
                                                    {defect.description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-mono text-cyber-400">
                                                        Confidence: <span className={config.color}>{Math.round(defect.confidence * 100)}%</span>
                                                    </span>
                                                    <span className="text-[10px] font-mono text-cyber-400">
                                                        Position: ({Math.round(defect.x)}%, {Math.round(defect.y)}%)
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-cyber-400 mt-1" />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12 text-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-5 h-5 text-neon-green" />
                            </div>
                            <p className="text-xs text-cyber-300">
                                {isInspecting ? 'Scanning for defects...' : 'No defects detected'}
                            </p>
                            {!isInspecting && (
                                <p className="text-[10px] text-cyber-400 mt-1">
                                    Start an inspection to detect issues
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

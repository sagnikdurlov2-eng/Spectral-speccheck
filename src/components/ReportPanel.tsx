import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react'
import type { ComparisonResult, DetectedDefect } from '../types'

interface ReportPanelProps {
    result: ComparisonResult | null
    isInspecting: boolean
    inspectionCount: number
}

function getSeveritySummary(defects: DetectedDefect[]) {
    return {
        critical: defects.filter((d) => d.severity === 'critical').length,
        warning: defects.filter((d) => d.severity === 'warning').length,
        info: defects.filter((d) => d.severity === 'info').length,
    }
}

function getTypeSummary(defects: DetectedDefect[]) {
    const types: Record<string, number> = {}
    defects.forEach((d) => {
        types[d.type] = (types[d.type] || 0) + 1
    })
    return types
}

export function ReportPanel({ result, isInspecting, inspectionCount }: ReportPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const severitySummary = result ? getSeveritySummary(result.defects) : { critical: 0, warning: 0, info: 0 }
    const typeSummary = result ? getTypeSummary(result.defects) : {}

    const overallGrade = result
        ? result.overallScore > 0.85
            ? 'A'
            : result.overallScore > 0.7
                ? 'B'
                : result.overallScore > 0.5
                    ? 'C'
                    : result.overallScore > 0.3
                        ? 'D'
                        : 'F'
        : '-'

    const gradeColor =
        overallGrade === 'A'
            ? 'text-neon-green'
            : overallGrade === 'B'
                ? 'text-neon-cyan'
                : overallGrade === 'C'
                    ? 'text-neon-yellow'
                    : overallGrade === 'D'
                        ? 'text-neon-orange'
                        : 'text-neon-red'

    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
        >
            <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neon-blue" />
                    <h2 className="text-sm font-semibold text-white">Inspection Report</h2>
                </div>
                {result && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-2.5 py-1 rounded-md bg-neon-blue/20 text-neon-blue text-[10px] font-mono border border-neon-blue/30 hover:bg-neon-blue/30 transition-colors"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                )}
            </div>

            <div className="p-4">
                {result ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`text-4xl font-bold font-mono ${gradeColor}`}>
                                {overallGrade}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle className={`w-4 h-4 ${gradeColor}`} />
                                    <span className="text-sm font-medium text-white">
                                        Inspection #{inspectionCount} Complete
                                    </span>
                                </div>
                                <p className="text-[11px] text-cyber-300">
                                    Overall score: {Math.round(result.overallScore * 100)}% | Alignment: {Math.round(result.alignmentScore * 100)}%
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="glass-panel-light rounded-lg p-2.5 text-center">
                                <div className="text-lg font-semibold font-mono text-neon-red">
                                    {severitySummary.critical}
                                </div>
                                <div className="text-[10px] font-mono text-cyber-400 uppercase">Critical</div>
                            </div>
                            <div className="glass-panel-light rounded-lg p-2.5 text-center">
                                <div className="text-lg font-semibold font-mono text-neon-yellow">
                                    {severitySummary.warning}
                                </div>
                                <div className="text-[10px] font-mono text-cyber-400 uppercase">Warnings</div>
                            </div>
                            <div className="glass-panel-light rounded-lg p-2.5 text-center">
                                <div className="text-lg font-semibold font-mono text-neon-cyan">
                                    {severitySummary.info}
                                </div>
                                <div className="text-[10px] font-mono text-cyber-400 uppercase">Info</div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    <div className="pt-3 border-t border-glass-border">
                                        <h3 className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider mb-2">
                                            Defect Breakdown
                                        </h3>
                                        <div className="space-y-1.5">
                                            {Object.entries(typeSummary).map(([type, count]) => (
                                                <div key={type} className="flex items-center justify-between">
                                                    <span className="text-[11px] text-cyber-300 capitalize">
                                                        {type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-white">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-glass-border">
                                        <h3 className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider mb-2">
                                            Recommendations
                                        </h3>
                                        <div className="space-y-2">
                                            {result.defects
                                                .filter((d) => d.severity === 'critical')
                                                .slice(0, 3)
                                                .map((defect, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <AlertTriangle className="w-3 h-3 text-neon-red mt-0.5 shrink-0" />
                                                        <span className="text-[11px] text-cyber-300">
                                                            Review {defect.type.replace('_', ' ')} at ({Math.round(defect.x)}%, {Math.round(defect.y)}%)
                                                        </span>
                                                    </div>
                                                ))}
                                            {result.defects.filter((d) => d.severity === 'critical').length === 0 && (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-3 h-3 text-neon-green" />
                                                    <span className="text-[11px] text-neon-green">
                                                        No critical issues found
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-glass-border">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-400">
                                            <Clock className="w-3 h-3" />
                                            Processing: {result.processingTime}ms
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/30 text-xs font-medium hover:bg-neon-blue/30 transition-all">
                            <Download className="w-3.5 h-3.5" />
                            Export Report
                        </button>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-glass-white flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-5 h-5 text-cyber-400" />
                        </div>
                        <p className="text-xs text-cyber-400">
                            {isInspecting ? 'Generating report...' : 'Run inspection to generate report'}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

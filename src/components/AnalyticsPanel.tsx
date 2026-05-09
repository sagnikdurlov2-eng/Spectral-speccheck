import { motion } from 'framer-motion'
import { ChartBar as BarChart3, Target, Layers, Palette, Ruler, Gauge } from 'lucide-react'
import type { ComparisonResult } from '../types'

interface AnalyticsPanelProps {
    result: ComparisonResult | null
    isInspecting: boolean
}

function MetricCard({
    icon: Icon,
    label,
    value,
    color,
    delay,
}: {
    icon: any
    label: string
    value: number
    color: string
    delay: number
}) {
    const percentage = Math.round(value * 100)
    const colorClass =
        color === 'cyan'
            ? 'text-neon-cyan'
            : color === 'green'
                ? 'text-neon-green'
                : color === 'red'
                    ? 'text-neon-red'
                    : color === 'yellow'
                        ? 'text-neon-yellow'
                        : color === 'blue'
                            ? 'text-neon-blue'
                            : 'text-neon-orange'

    const barColor =
        color === 'cyan'
            ? 'bg-neon-cyan'
            : color === 'green'
                ? 'bg-neon-green'
                : color === 'red'
                    ? 'bg-neon-red'
                    : color === 'yellow'
                        ? 'bg-neon-yellow'
                        : color === 'blue'
                            ? 'bg-neon-blue'
                            : 'bg-neon-orange'

    return (
        <motion.div
            className="glass-panel-light rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                    <span className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider">
                        {label}
                    </span>
                </div>
                <span className={`text-sm font-semibold font-mono ${colorClass}`}>
                    {percentage}%
                </span>
            </div>
            <div className="h-1.5 rounded-full bg-cyber-700 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay + 0.2 }}
                />
            </div>
        </motion.div>
    )
}

function HeatmapGrid({ data }: { data: number[][] }) {
    return (
        <div className="grid grid-cols-8 gap-0.5">
            {data.flat().map((value, i) => {
                const intensity = Math.min(1, value * 3)
                const r = Math.round(255 * intensity)
                const g = Math.round(60 * (1 - intensity))
                const b = Math.round(68 * intensity)
                return (
                    <motion.div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.01 }}
                    />
                )
            })}
        </div>
    )
}

export function AnalyticsPanel({ result, isInspecting }: AnalyticsPanelProps) {
    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-neon-cyan" />
                    <h2 className="text-sm font-semibold text-white">Live Analytics</h2>
                </div>
                {isInspecting && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        <span className="text-[10px] font-mono text-neon-green">LIVE</span>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-4">
                {result ? (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <MetricCard
                                icon={Target}
                                label="Alignment"
                                value={result.alignmentScore}
                                color="cyan"
                                delay={0}
                            />
                            <MetricCard
                                icon={Gauge}
                                label="Overall"
                                value={result.overallScore}
                                color="green"
                                delay={0.05}
                            />
                            <MetricCard
                                icon={Layers}
                                label="Coverage"
                                value={result.overallScore * 0.9 + 0.1}
                                color="blue"
                                delay={0.1}
                            />
                            <MetricCard
                                icon={Ruler}
                                label="Spacing"
                                value={1 - result.defects.filter((d) => d.type === 'spacing').length * 0.15}
                                color="yellow"
                                delay={0.15}
                            />
                            <MetricCard
                                icon={Palette}
                                label="Color"
                                value={1 - result.defects.filter((d) => d.type === 'color').length * 0.12}
                                color="orange"
                                delay={0.2}
                            />
                            <MetricCard
                                icon={BarChart3}
                                label="Layout"
                                value={1 - result.defects.filter((d) => d.type === 'layout').length * 0.1}
                                color="cyan"
                                delay={0.25}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider">
                                    Difference Heatmap
                                </span>
                                <span className="text-[10px] font-mono text-cyber-400">
                                    {result.processingTime}ms
                                </span>
                            </div>
                            <HeatmapGrid data={result.heatmapData} />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                            <span className="text-[10px] font-mono text-cyber-300 uppercase">
                                Defects Found
                            </span>
                            <span className={`text-sm font-semibold font-mono ${result.defects.length > 5 ? 'text-neon-red' : result.defects.length > 2 ? 'text-neon-yellow' : 'text-neon-green'
                                }`}>
                                {result.defects.length}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-glass-white flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="w-5 h-5 text-cyber-400" />
                        </div>
                        <p className="text-xs text-cyber-400">
                            {isInspecting ? 'Analyzing...' : 'Start inspection to see analytics'}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

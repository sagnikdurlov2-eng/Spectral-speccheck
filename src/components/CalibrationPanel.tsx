import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileSliders as Sliders, RotateCcw, Crosshair, Move, ZoomIn } from 'lucide-react'
import type { CalibrationData } from '../types'

interface CalibrationPanelProps {
    calibration: CalibrationData
    onUpdateCalibration: (data: Partial<CalibrationData>) => void
    onResetCalibration: () => void
}

export function CalibrationPanel({
    calibration,
    onUpdateCalibration,
    onResetCalibration,
}: CalibrationPanelProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-glass-hover transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-neon-orange" />
                    <h2 className="text-sm font-semibold text-white">AI Calibration</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neon-green">ACTIVE</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg className="w-4 h-4 text-cyber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </div>
            </button>

            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 space-y-4"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Crosshair className="w-3.5 h-3.5 text-neon-cyan" />
                            <span className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider">
                                Perspective Correction
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono text-cyber-400">Rotation</label>
                                <span className="text-[10px] font-mono text-neon-cyan">
                                    {calibration.rotation.toFixed(1)}deg
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-45"
                                max="45"
                                step="0.5"
                                value={calibration.rotation}
                                onChange={(e) =>
                                    onUpdateCalibration({ rotation: parseFloat(e.target.value) })
                                }
                                className="w-full h-1 rounded-full appearance-none bg-cyber-700 accent-neon-cyan"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono text-cyber-400">Scale X</label>
                                <span className="text-[10px] font-mono text-neon-cyan">
                                    {calibration.scale.x.toFixed(2)}x
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.05"
                                value={calibration.scale.x}
                                onChange={(e) =>
                                    onUpdateCalibration({
                                        scale: { ...calibration.scale, x: parseFloat(e.target.value) },
                                    })
                                }
                                className="w-full h-1 rounded-full appearance-none bg-cyber-700 accent-neon-cyan"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono text-cyber-400">Scale Y</label>
                                <span className="text-[10px] font-mono text-neon-cyan">
                                    {calibration.scale.y.toFixed(2)}x
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.05"
                                value={calibration.scale.y}
                                onChange={(e) =>
                                    onUpdateCalibration({
                                        scale: { ...calibration.scale, y: parseFloat(e.target.value) },
                                    })
                                }
                                className="w-full h-1 rounded-full appearance-none bg-cyber-700 accent-neon-cyan"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Move className="w-3.5 h-3.5 text-neon-blue" />
                            <span className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider">
                                Offset Adjustment
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono text-cyber-400">Offset X</label>
                                <span className="text-[10px] font-mono text-neon-blue">
                                    {calibration.offset.x.toFixed(0)}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-200"
                                max="200"
                                step="1"
                                value={calibration.offset.x}
                                onChange={(e) =>
                                    onUpdateCalibration({
                                        offset: { ...calibration.offset, x: parseFloat(e.target.value) },
                                    })
                                }
                                className="w-full h-1 rounded-full appearance-none bg-cyber-700 accent-neon-blue"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono text-cyber-400">Offset Y</label>
                                <span className="text-[10px] font-mono text-neon-blue">
                                    {calibration.offset.y.toFixed(0)}px
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-200"
                                max="200"
                                step="1"
                                value={calibration.offset.y}
                                onChange={(e) =>
                                    onUpdateCalibration({
                                        offset: { ...calibration.offset, y: parseFloat(e.target.value) },
                                    })
                                }
                                className="w-full h-1 rounded-full appearance-none bg-cyber-700 accent-neon-blue"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-glass-border">
                        <button
                            onClick={onResetCalibration}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-glass-white text-cyber-300 text-[10px] font-mono hover:bg-glass-hover transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neon-cyan/20 text-neon-cyan text-[10px] font-mono border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors">
                            <ZoomIn className="w-3 h-3" />
                            Auto-Calibrate
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

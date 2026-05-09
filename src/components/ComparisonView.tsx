import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, Eye, Box } from 'lucide-react'
import { Blueprint3D } from './Blueprint3D'
import { ExtraVision } from './ExtraVision'
import type { VisionMode } from './ExtraVision'
import type { ComparisonResult } from '../types'

interface ComparisonViewProps {
    referenceImage: HTMLImageElement | null
    liveCanvas: HTMLCanvasElement | null
    result: ComparisonResult | null
    isInspecting: boolean
}

export function ComparisonView({
    referenceImage,
    liveCanvas,
    result,
    isInspecting,
}: ComparisonViewProps) {
    const [is3D, setIs3D] = useState(false)
    const [visionMode, setVisionMode] = useState<VisionMode>('STANDARD')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current || !referenceImage || !liveCanvas) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const width = Math.max(referenceImage.width, liveCanvas.width)
        const height = Math.max(referenceImage.height, liveCanvas.height)
        canvas.width = width
        canvas.height = height

        ctx.clearRect(0, 0, width, height)

        // Draw reference image
        ctx.globalAlpha = 0.5
        ctx.drawImage(referenceImage, 0, 0, width, height)

        // Draw live feed overlay
        ctx.globalAlpha = 0.5
        ctx.globalCompositeOperation = 'difference'
        ctx.drawImage(liveCanvas, 0, 0, width, height)

        // Reset composite
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1

        // Draw defect highlights
        if (result) {
            result.defects.forEach((defect) => {
                const x = (defect.x / 100) * width
                const y = (defect.y / 100) * height
                const w = (defect.width / 100) * width
                const h = (defect.height / 100) * height

                const color =
                    defect.severity === 'critical'
                        ? 'rgba(255, 0, 68, 0.4)'
                        : defect.severity === 'warning'
                            ? 'rgba(255, 204, 0, 0.3)'
                            : 'rgba(0, 240, 255, 0.2)'

                ctx.fillStyle = color
                ctx.fillRect(x, y, w, h)

                ctx.strokeStyle =
                    defect.severity === 'critical'
                        ? '#ff0044'
                        : defect.severity === 'warning'
                            ? '#ffcc00'
                            : '#00f0ff'
                ctx.lineWidth = 1.5
                ctx.setLineDash([4, 4])
                ctx.strokeRect(x, y, w, h)
                ctx.setLineDash([])
            })
        }
    }, [referenceImage, liveCanvas, result])

    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <div className="px-4 py-3 border-b border-glass-border flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-neon-green" />
                    <h2 className="text-sm font-semibold text-white">Comparison View</h2>
                </div>
                
                <div className="flex items-center gap-4">
                    <ExtraVision mode={visionMode} onChangeMode={setVisionMode} />
                    
                    <div className="flex items-center gap-2 border-l border-cyber-800 pl-4">
                        {result && (
                            <div className="flex items-center gap-2 mr-2">
                                <Eye className="w-3.5 h-3.5 text-cyber-300" />
                                <span className="text-[10px] font-mono text-cyber-300">
                                    Difference Blend
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => setIs3D(!is3D)}
                            className={`p-1.5 rounded-md transition-all ${is3D
                                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                                    : 'glass-panel-light text-cyber-300 hover:bg-glass-hover'
                                }`}
                            title="Toggle 3D View"
                        >
                            <Box className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {referenceImage && liveCanvas ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-cyber-800">
                        {is3D ? (
                            <Blueprint3D image={referenceImage} />
                        ) : (
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full object-contain transition-all duration-300"
                                style={{
                                    filter: visionMode === 'THERMAL' 
                                        ? 'sepia(1) hue-rotate(300deg) saturate(4) invert(0.2) contrast(1.5)'
                                        : visionMode === 'EDGE'
                                        ? 'contrast(2) invert(1) grayscale(1)'
                                        : 'none'
                                }}
                            />
                        )}
                        {result && (
                            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-cyber-900/80 border border-glass-border">
                                <span className={`text-[10px] font-mono ${result.overallScore > 0.8 ? 'text-neon-green' : result.overallScore > 0.5 ? 'text-neon-yellow' : 'text-neon-red'
                                    }`}>
                                    Match: {Math.round(result.overallScore * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="aspect-video rounded-lg bg-cyber-800 flex items-center justify-center">
                        <div className="text-center">
                            <GitCompare className="w-8 h-8 text-cyber-400 mx-auto mb-2" />
                            <p className="text-xs text-cyber-400">
                                {isInspecting ? 'Waiting for data...' : 'Upload reference & start camera'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

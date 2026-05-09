import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, CameraOff, Maximize2 } from 'lucide-react'
import type { DetectedDefect } from '../types'

interface WebcamViewProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isStreaming: boolean
    startStream: () => Promise<void>
    stopStream: () => void
    error: string | null
    defects: DetectedDefect[]
    isInspecting: boolean
    onCaptureFrame: () => HTMLCanvasElement | null
}

export function WebcamView({
    videoRef,
    isStreaming,
    startStream,
    stopStream,
    error,
    defects,
    isInspecting,
}: WebcamViewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animFrameRef = useRef<number>(0)

    useEffect(() => {
        if (!isStreaming || !isInspecting) return

        const drawOverlay = () => {
            const canvas = canvasRef.current
            const video = videoRef.current
            if (!canvas || !video) return

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw scan line
            const scanY = (Date.now() / 10) % canvas.height
            const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30)
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0)')
            gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.15)')
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, scanY - 30, canvas.width, 60)

            // Draw defect markers
            defects.forEach((defect) => {
                const x = (defect.x / 100) * canvas.width
                const y = (defect.y / 100) * canvas.height
                const w = (defect.width / 100) * canvas.width
                const h = (defect.height / 100) * canvas.height

                const color =
                    defect.severity === 'critical'
                        ? 'rgba(255, 0, 68, 0.6)'
                        : defect.severity === 'warning'
                            ? 'rgba(255, 204, 0, 0.5)'
                            : 'rgba(0, 240, 255, 0.3)'

                const borderColor =
                    defect.severity === 'critical'
                        ? '#ff0044'
                        : defect.severity === 'warning'
                            ? '#ffcc00'
                            : '#00f0ff'

                ctx.fillStyle = color
                ctx.fillRect(x, y, w, h)
                ctx.strokeStyle = borderColor
                ctx.lineWidth = 2
                ctx.strokeRect(x, y, w, h)

                // Corner markers
                const cornerSize = 8
                ctx.strokeStyle = borderColor
                ctx.lineWidth = 2
                // Top-left
                ctx.beginPath()
                ctx.moveTo(x, y + cornerSize)
                ctx.lineTo(x, y)
                ctx.lineTo(x + cornerSize, y)
                ctx.stroke()
                // Top-right
                ctx.beginPath()
                ctx.moveTo(x + w - cornerSize, y)
                ctx.lineTo(x + w, y)
                ctx.lineTo(x + w, y + cornerSize)
                ctx.stroke()
                // Bottom-left
                ctx.beginPath()
                ctx.moveTo(x, y + h - cornerSize)
                ctx.lineTo(x, y + h)
                ctx.lineTo(x + cornerSize, y + h)
                ctx.stroke()
                // Bottom-right
                ctx.beginPath()
                ctx.moveTo(x + w - cornerSize, y + h)
                ctx.lineTo(x + w, y + h)
                ctx.lineTo(x + w, y + h - cornerSize)
                ctx.stroke()

                // Confidence label
                const label = `${Math.round(defect.confidence * 100)}%`
                ctx.font = '11px monospace'
                const textWidth = ctx.measureText(label).width
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
                ctx.fillRect(x, y - 16, textWidth + 8, 16)
                ctx.fillStyle = borderColor
                ctx.fillText(label, x + 4, y - 4)
            })

            // Draw grid overlay
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)'
            ctx.lineWidth = 1
            const gridStep = canvas.width / 8
            for (let i = 0; i <= 8; i++) {
                ctx.beginPath()
                ctx.moveTo(i * gridStep, 0)
                ctx.lineTo(i * gridStep, canvas.height)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(0, i * gridStep)
                ctx.lineTo(canvas.width, i * gridStep)
                ctx.stroke()
            }

            animFrameRef.current = requestAnimationFrame(drawOverlay)
        }

        animFrameRef.current = requestAnimationFrame(drawOverlay)
        return () => cancelAnimationFrame(animFrameRef.current)
    }, [isStreaming, isInspecting, defects, videoRef])

    return (
        <motion.div
            className="relative glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-neon-green animate-pulse' : 'bg-cyber-400'}`} />
                <span className="text-[10px] font-mono text-cyber-300 uppercase tracking-wider">
                    {isStreaming ? 'Live Feed' : 'Offline'}
                </span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                {isStreaming && (
                    <button className="p-1.5 rounded-md glass-panel-light hover:bg-glass-hover transition-colors">
                        <Maximize2 className="w-3.5 h-3.5 text-cyber-300" />
                    </button>
                )}
            </div>

            <div className="relative aspect-video bg-cyber-900 flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {!isStreaming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cyber-900/80">
                        <div className="w-16 h-16 rounded-full border-2 border-cyber-400 flex items-center justify-center">
                            <Camera className="w-7 h-7 text-cyber-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-cyber-300 mb-1">Camera feed inactive</p>
                            <p className="text-xs text-cyber-400">Click below to start streaming</p>
                        </div>
                        <button
                            onClick={startStream}
                            className="px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 text-sm font-medium hover:bg-neon-cyan/30 transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Enable Camera
                            </span>
                        </button>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cyber-900/90">
                        <div className="text-center">
                            <CameraOff className="w-10 h-10 text-neon-red mx-auto mb-2" />
                            <p className="text-sm text-neon-red">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {isStreaming && (
                <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-cyber-300">
                                {isInspecting ? 'INSPECTING' : 'MONITORING'}
                            </span>
                            {isInspecting && (
                                <span className="text-[10px] font-mono text-neon-red animate-pulse">
                                    REC
                                </span>
                            )}
                        </div>
                        <button
                            onClick={stopStream}
                            className="px-3 py-1 rounded-md bg-neon-red/20 text-neon-red border border-neon-red/30 text-xs font-medium hover:bg-neon-red/30 transition-all"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

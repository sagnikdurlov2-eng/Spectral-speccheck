import { useState, useRef, useCallback, useEffect } from 'react'
import { Header } from '../components/Header'
import { WebcamView } from '../components/WebcamView'
import { ReferencePanel } from '../components/ReferencePanel'
import { AnalyticsPanel } from '../components/AnalyticsPanel'
import { DefectList } from '../components/DefectList'
import { CalibrationPanel } from '../components/CalibrationPanel'
import { ComparisonView } from '../components/ComparisonView'
import { ReportPanel } from '../components/ReportPanel'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { useWebcam } from '../hooks/useWebcam'
import { useImageComparison } from '../hooks/useImageComparison'
import { convertToBlueprint } from '../lib/imageUtils'
import type { ImageType, DetectedDefect } from '../types'
import { PipelineAgent } from '../components/PipelineAgent'
import { SimulationPanel } from '../components/SimulationPanel'

export function Dashboard() {
  const { videoRef, isStreaming, startStream, stopStream, captureFrame, error } = useWebcam()
  const { result, isProcessing, compare, calibration, updateCalibration, resetCalibration } =
    useImageComparison()

  const [isInspecting, setIsInspecting] = useState(false)
  const [referenceImage, setReferenceImage] = useState<HTMLImageElement | null>(null)
  const [defects, setDefects] = useState<DetectedDefect[]>([])
  const [liveCanvas, setLiveCanvas] = useState<HTMLCanvasElement | null>(null)
  const [inspectionCount, setInspectionCount] = useState(0)

  const refCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleImageLoad = useCallback(
    async (img: HTMLImageElement, _name: string, type: ImageType) => {
      let displayImage = img
      
      if (type === 'blueprint') {
        const blueprintSrc = await convertToBlueprint(img)
        const newImg = new Image()
        newImg.src = blueprintSrc
        await new Promise((resolve) => {
          newImg.onload = resolve
        })
        displayImage = newImg
      }

      setReferenceImage(displayImage)
      const canvas = document.createElement('canvas')
      canvas.width = displayImage.width
      canvas.height = displayImage.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(displayImage, 0, 0)
      }
      refCanvasRef.current = canvas
    },
    []
  )

  const handleClearImage = useCallback(() => {
    setReferenceImage(null)
    refCanvasRef.current = null
  }, [])

  const runInspection = useCallback(() => {
    if (!refCanvasRef.current || !isStreaming) return

    const frame = captureFrame()
    if (!frame) return

    setLiveCanvas(frame)
    const comparisonResult = compare(refCanvasRef.current, frame)
    if (comparisonResult) {
      setDefects(comparisonResult.defects)
    }
  }, [isStreaming, captureFrame, compare])

  const toggleInspection = useCallback(() => {
    if (isInspecting) {
      setIsInspecting(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      if (!isStreaming) {
        startStream().then(() => {
          setIsInspecting(true)
          setInspectionCount((c) => c + 1)
          intervalRef.current = setInterval(runInspection, 2000)
        })
      } else {
        setIsInspecting(true)
        setInspectionCount((c) => c + 1)
        intervalRef.current = setInterval(runInspection, 2000)
      }
    }
  }, [isInspecting, isStreaming, startStream, runInspection])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-cyber-900 relative">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isInspecting={isInspecting} onToggleInspection={toggleInspection} />

        <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left column - Camera & Reference */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-6">
              <WebcamView
                videoRef={videoRef}
                isStreaming={isStreaming}
                startStream={startStream}
                stopStream={stopStream}
                error={error}
                defects={defects}
                isInspecting={isInspecting}
                onCaptureFrame={captureFrame}
              />
              <ReferencePanel
                referenceImage={referenceImage}
                onImageLoad={handleImageLoad}
                onClearImage={handleClearImage}
              />
              <SimulationPanel referenceImage={referenceImage} />
            </div>

            {/* Center column - Comparison & Defects */}
            <div className="lg:col-span-4 space-y-4 lg:space-y-6">
              <ComparisonView
                referenceImage={referenceImage}
                liveCanvas={liveCanvas}
                result={result}
                isInspecting={isInspecting}
              />
              <DefectList defects={defects} isInspecting={isInspecting} />
            </div>

            {/* Right column - Analytics & Calibration & Report */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-6">
              <AnalyticsPanel result={result} isInspecting={isInspecting} />
              <PipelineAgent isInspecting={isInspecting} isProcessing={isProcessing} inspectionCount={inspectionCount} />
              <CalibrationPanel
                calibration={calibration}
                onUpdateCalibration={updateCalibration}
                onResetCalibration={resetCalibration}
              />
              <ReportPanel
                result={result}
                isInspecting={isInspecting}
                inspectionCount={inspectionCount}
              />
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-6 glass-panel rounded-lg px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-neon-green animate-pulse' : 'bg-cyber-400'}`} />
                <span className="text-[10px] font-mono text-cyber-300">
                  {isStreaming ? 'CAMERA ACTIVE' : 'CAMERA OFFLINE'}
                </span>
              </div>
              <div className="w-px h-3 bg-cyber-600" />
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-neon-yellow animate-pulse' : 'bg-cyber-400'}`} />
                <span className="text-[10px] font-mono text-cyber-300">
                  {isProcessing ? 'PROCESSING' : 'AI ENGINE IDLE'}
                </span>
              </div>
              <div className="w-px h-3 bg-cyber-600" />
              <span className="text-[10px] font-mono text-cyber-400">
                Inspections: {inspectionCount}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {result && (
                <span className="text-[10px] font-mono text-cyber-400">
                  Last scan: {result.processingTime}ms
                </span>
              )}
              <span className="text-[10px] font-mono text-cyber-400">
                v1.0.0
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

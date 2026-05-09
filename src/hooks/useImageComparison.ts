import { useState, useCallback } from 'react'
import type { ComparisonResult, CalibrationData, DetectedDefect } from '../types'

const DEFAULT_CALIBRATION: CalibrationData = {
  perspectiveMatrix: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  scale: { x: 1, y: 1 },
  rotation: 0,
  offset: { x: 0, y: 0 },
}

export function useImageComparison() {
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [calibration, setCalibration] = useState<CalibrationData>(DEFAULT_CALIBRATION)

  const updateCalibration = useCallback((data: Partial<CalibrationData>) => {
    setCalibration((prev) => ({ ...prev, ...data }))
  }, [])

  const resetCalibration = useCallback(() => {
    setCalibration(DEFAULT_CALIBRATION)
  }, [])

  const compare = useCallback((reference: HTMLCanvasElement, live: HTMLCanvasElement): ComparisonResult | null => {
    setIsProcessing(true)
    const startTime = performance.now()

    try {
      const refCtx = reference.getContext('2d')
      const liveCtx = live.getContext('2d')
      
      if (!refCtx || !liveCtx) return null

      const width = reference.width
      const height = reference.height

      const refData = refCtx.getImageData(0, 0, width, height).data
      const liveData = liveCtx.getImageData(0, 0, width, height).data

      const defects: DetectedDefect[] = []
      let totalDiff = 0
      
      // Simple grid-based comparison for performance
      const gridSize = 20
      const threshold = 40 // Pixel difference threshold

      for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
          let blockDiff = 0
          
          // Sample pixels in the block
          for (let by = 0; by < gridSize && y + by < height; by++) {
            for (let bx = 0; bx < gridSize && x + bx < width; bx++) {
              const idx = ((y + by) * width + (x + bx)) * 4
              const rDiff = Math.abs(refData[idx] - liveData[idx])
              const gDiff = Math.abs(refData[idx + 1] - liveData[idx + 1])
              const bDiff = Math.abs(refData[idx + 2] - liveData[idx + 2])
              
              blockDiff += (rDiff + gDiff + bDiff) / 3
            }
          }

          const avgBlockDiff = blockDiff / (gridSize * gridSize)
          totalDiff += avgBlockDiff

          if (avgBlockDiff > threshold) {
            defects.push({
              type: 'layout',
              severity: avgBlockDiff > threshold * 2 ? 'critical' : 'warning',
              confidence: Math.min(0.99, avgBlockDiff / 100),
              x: (x / width) * 100,
              y: (y / height) * 100,
              width: (gridSize / width) * 100,
              height: (gridSize / height) * 100,
              description: `Anomalous pixel variation detected at block (${x}, ${y})`,
            })
          }
        }
      }

      // Group adjacent blocks into larger defects (basic clustering)
      // For now, we'll just return the grid blocks as individual defects
      
      const overallScore = Math.max(0, (100 - (totalDiff / (width * height / gridSize / gridSize))) / 100)
      const alignmentScore = 0.95 // Mock alignment score

      const comparisonResult: ComparisonResult = {
        alignmentScore,
        overallScore,
        defects,
        heatmapData: [], // Would populate with more sophisticated logic
        processingTime: Math.round(performance.now() - startTime),
      }

      setResult(comparisonResult)
      setIsProcessing(false)
      return comparisonResult
    } catch (err) {
      console.error('Comparison error:', err)
      setIsProcessing(false)
      return null
    }
  }, [])

  return {
    result,
    isProcessing,
    compare,
    calibration,
    updateCalibration,
    resetCalibration,
  }
}

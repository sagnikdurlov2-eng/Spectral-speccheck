import { useState, useRef, useCallback } from 'react'

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
        setError(null)
      }
    } catch (err) {
      console.error('Error accessing webcam:', err)
      setError('Could not access camera. Please ensure permissions are granted.')
      setIsStreaming(false)
    }
  }, [])

  const stopStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isStreaming) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      return canvas
    }
    return null
  }, [isStreaming])

  return {
    videoRef,
    isStreaming,
    startStream,
    stopStream,
    captureFrame,
    error,
  }
}

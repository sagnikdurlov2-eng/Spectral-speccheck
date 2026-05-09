export async function convertToBlueprint(img: HTMLImageElement): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return img.src

  canvas.width = img.width
  canvas.height = img.height
  
  // Draw original image
  ctx.drawImage(img, 0, 0)
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width
  const height = canvas.height

  // 1. Edge Detection (Sobel-like)
  const grayscale = new Uint8ClampedArray(width * height)
  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
  }

  const edges = new Uint8ClampedArray(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      const horizontal = 
        -grayscale[idx - width - 1] + grayscale[idx - width + 1] +
        -2 * grayscale[idx - 1] + 2 * grayscale[idx + 1] +
        -grayscale[idx + width - 1] + grayscale[idx + width + 1]
      
      const vertical = 
        -grayscale[idx - width - 1] - 2 * grayscale[idx - width] - grayscale[idx - width + 1] +
        grayscale[idx + width - 1] + 2 * grayscale[idx + width] + grayscale[idx + width + 1]
      
      const magnitude = Math.sqrt(horizontal * horizontal + vertical * vertical)
      edges[idx] = magnitude > 30 ? 255 : 0
    }
  }

  // 2. Render Blueprint
  // Fill background
  ctx.fillStyle = '#003366' // Deep blueprint blue
  ctx.fillRect(0, 0, width, height)

  // Draw grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  const gridSize = 40
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw white edges
  const finalImageData = ctx.getImageData(0, 0, width, height)
  const finalData = finalImageData.data
  for (let i = 0; i < edges.length; i++) {
    if (edges[i] === 255) {
      const idx = i * 4
      finalData[idx] = 255     // R
      finalData[idx + 1] = 255 // G
      finalData[idx + 2] = 255 // B
      finalData[idx + 3] = 255 // A
    }
  }
  ctx.putImageData(finalImageData, 0, 0)

  return canvas.toDataURL('image/png')
}

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Blueprint3DProps {
  image: HTMLImageElement | null
}

function LidarPointCloud({ image }: { image: HTMLImageElement }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors, worldW, worldH } = useMemo(() => {
    if (!image) return { positions: new Float32Array(), colors: new Float32Array(), worldW: 5, worldH: 5 }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    // Very high density point cloud for LiDAR effect
    const segs = 200
    const aspect = image.width / image.height
    
    let w = segs
    let h = segs
    if (aspect > 1) {
      h = Math.floor(segs / aspect)
    } else {
      w = Math.floor(segs * aspect)
    }

    canvas.width = w
    canvas.height = h

    const worldW = 7
    const worldH = 7 / aspect

    const posArray = []
    const colArray = []

    if (ctx) {
      ctx.drawImage(image, 0, 0, w, h)
      const imgData = ctx.getImageData(0, 0, w, h).data

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pixelIdx = (y * w + x) * 4
          const r = imgData[pixelIdx]
          const g = imgData[pixelIdx + 1]
          const b = imgData[pixelIdx + 2]

          const brightness = (r + g + b) / (3 * 255)

          // Only extract structural points (edges and bright areas) to form the blueprint
          // Introduce slight random dropping to look like an imperfect laser scan
          if (brightness > 0.08 && Math.random() > 0.15) {
            const posX = (x / w - 0.5) * worldW
            const posY = -(y / h - 0.5) * worldH // invert Y for correct orientation
            
            // Complex depth estimation to simulate 3D structure
            // Combines brightness extrusion with a subtle center bulge (lens effect)
            const distFromCenter = Math.sqrt(posX * posX + posY * posY)
            const lensCurve = Math.max(0, 1 - distFromCenter * 0.3)
            
            const depth = (brightness * 1.5) + (lensCurve * 0.5)

            // Add microscopic jitter to make it look like raw sensor data
            const jitterX = (Math.random() - 0.5) * 0.015
            const jitterY = (Math.random() - 0.5) * 0.015
            const jitterZ = (Math.random() - 0.5) * 0.03
            
            posArray.push(posX + jitterX, posY + jitterY, depth + jitterZ)
            
            // Create a glowing holographic material color (blend image with cyan)
            const color = new THREE.Color(`rgb(${r},${g},${b})`)
            const neon = new THREE.Color('#00ffff')
            color.lerp(neon, 0.4) // 40% neon cyan tint
            
            colArray.push(color.r, color.g, color.b)
          }
        }
      }
    }

    return { 
      positions: new Float32Array(posArray), 
      colors: new Float32Array(colArray),
      worldW, 
      worldH 
    }
  }, [image])

  useFrame((state) => {
    if (pointsRef.current) {
      // Cinematic slow pan
      pointsRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
      pointsRef.current.rotation.x = -0.15 + Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1
      
      // Pulsing particle size
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.size = 0.015 + Math.sin(state.clock.getElapsedTime() * 4) * 0.005
    }
  })

  if (positions.length === 0) return null

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group rotation={[-Math.PI / 8, 0, 0]}>
        
        {/* Core Volumetric LiDAR Point Cloud */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* AI Structural Bounding Box */}
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[worldW + 0.4, worldH + 0.4, 2.5]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.15} />
        </mesh>
        
        {/* Holographic Backplate */}
        <mesh position={[0, 0, -0.5]}>
          <planeGeometry args={[worldW + 1, worldH + 1]} />
          <meshBasicMaterial color="#000814" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, -0.49]}>
          <planeGeometry args={[worldW + 1, worldH + 1, 12, 12]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.2} />
        </mesh>

      </group>
    </Float>
  )
}

function SimulationEnvironment() {
  return (
    <>
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={12} size={1} speed={0.8} color="#00f0ff" opacity={0.5} />
      <Grid
        infiniteGrid
        fadeDistance={25}
        sectionSize={1}
        sectionColor="#00f0ff"
        sectionThickness={1.5}
        cellColor="#004466"
        cellThickness={0.8}
        cellSize={0.5}
        position={[0, -3.5, 0]}
      />
    </>
  )
}

function ScanLine() {
  const lineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (lineRef.current) {
      // Sweeping scan plane moving back and forth through the Z depth
      lineRef.current.position.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 2.0
    }
  })

  return (
    <mesh ref={lineRef} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={0.08} 
        side={THREE.DoubleSide} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export function Blueprint3D({ image }: Blueprint3DProps) {
  if (!image) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cyber-900/50 rounded-lg border border-glass-border">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border border-cyber-500 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-cyber-500 text-lg">3D</span>
          </div>
          <p className="text-xs text-cyber-400 font-mono">INITIALIZING AI SPATIAL ENGINE...</p>
          <p className="text-[10px] text-cyber-500 mt-1">Awaiting target structural scan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-cyber-950 rounded-lg overflow-hidden relative border border-neon-cyan/20 group">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          LiDAR VOLUMETRIC RECONSTRUCTION
        </span>
        <span className="text-[8px] font-mono text-cyber-400 animate-pulse">
          EXTRACTING 3D POINT CLOUD FROM 2D DATA...
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-right opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[8px] font-mono text-cyber-500">
          SPATIAL MAP: ACTIVE | RESOLUTION: 40k PTS
        </p>
      </div>

      <Canvas shadows dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 2, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={45} />
        <OrbitControls
          enablePan={true}
          minDistance={3}
          maxDistance={15}
          autoRotate={true}
          autoRotateSpeed={0.5}
          makeDefault
        />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />

        <LidarPointCloud image={image} />
        <SimulationEnvironment />
        <ScanLine />

        <fog attach="fog" args={['#05080a', 6, 20]} />
      </Canvas>
    </div>
  )
}


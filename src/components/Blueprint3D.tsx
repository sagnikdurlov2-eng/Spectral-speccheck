import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Blueprint3DProps {
  image: HTMLImageElement | null
}

function DynamicBlueprint({ image }: { image: HTMLImageElement }) {
  const meshRef = useRef<THREE.Group>(null)
  
  const { geometry, texture, worldW, worldH } = useMemo(() => {
    if (!image) return { geometry: null, texture: null, worldW: 5, worldH: 5 }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    const segs = 128
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

    let geom = null
    const worldW = 5
    const worldH = 5 / aspect

    if (ctx) {
      ctx.drawImage(image, 0, 0, w, h)
      const imgData = ctx.getImageData(0, 0, w, h).data

      geom = new THREE.PlaneGeometry(worldW, worldH, w - 1, h - 1)
      const positions = geom.attributes.position.array

      for (let i = 0; i < positions.length; i += 3) {
        const vertexIndex = i / 3
        const x = vertexIndex % w
        const y = Math.floor(vertexIndex / w)
        
        if (y >= h) continue

        const pixelY = y
        const pixelIdx = (pixelY * w + x) * 4
        
        const r = imgData[pixelIdx]
        const g = imgData[pixelIdx + 1]
        const b = imgData[pixelIdx + 2]

        // Calculate brightness
        const brightness = (r + g + b) / (3 * 255)
        
        // Extrude z based on brightness (bright pixels push OUT)
        positions[i + 2] = brightness * 1.5 
      }
      geom.computeVertexNormals()
    }

    const tex = new THREE.Texture(image)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true

    return { geometry: geom, texture: tex, worldW, worldH }
  }, [image])

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle orbit oscillation to show depth
      meshRef.current.parent!.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  if (!geometry) return null

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group rotation={[-Math.PI / 4, 0, 0]}>
        <group ref={meshRef}>
          
          {/* Extruded relief map */}
          <mesh geometry={geometry} receiveShadow castShadow>
            <meshStandardMaterial 
              map={texture}
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveMap={texture}
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
              roughness={0.4}
              metalness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wireframe overlay for blueprint look */}
          <mesh geometry={geometry} position={[0, 0, 0.01]}>
            <meshBasicMaterial 
              color="#00ffff" 
              wireframe 
              transparent 
              opacity={0.15} 
            />
          </mesh>

          {/* Foundation Base */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[worldW + 0.4, worldH + 0.4, 0.1]} />
            <meshBasicMaterial color="#001122" transparent opacity={0.6} />
          </mesh>

          {/* Glowing Perimeter */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[worldW + 0.4, worldH + 0.4, 0.05]} />
            <meshBasicMaterial wireframe color="#00f0ff" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

function SimulationEnvironment() {
  return (
    <>
      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={50} scale={10} size={1} speed={0.5} color="#00f0ff" />
      <Grid
        infiniteGrid
        fadeDistance={20}
        sectionSize={1}
        sectionColor="#00f0ff"
        sectionThickness={1.5}
        cellColor="#004466"
        cellThickness={0.8}
        cellSize={0.5}
        position={[0, -2.5, 0]}
      />
    </>
  )
}

function ScanLine() {
  const lineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (lineRef.current) {
      // Move scanline across the 3D space
      lineRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 2.5
    }
  })

  return (
    <mesh ref={lineRef} position={[0, 0, 1]}>
      <boxGeometry args={[6, 0.05, 0.05]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
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
          <p className="text-xs text-cyber-400 font-mono">INITIALIZING 3D SIMULATION ENGINE...</p>
          <p className="text-[10px] text-cyber-500 mt-1">Please upload a reference image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-cyber-950 rounded-lg overflow-hidden relative border border-neon-cyan/20 group">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20 backdrop-blur-sm">
          FULL 3D SIMULATION ACTIVE
        </span>
        <span className="text-[8px] font-mono text-cyber-400 animate-pulse">
          EXTRUDING TOPOLOGY FROM SCAN DATA...
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-right opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[8px] font-mono text-cyber-500">
          PITCH: 45.2° | YAW: 12.8° | ZOOM: 1.2x
        </p>
      </div>

      <Canvas shadows dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 2, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[4, 4, 8]} fov={40} />
        <OrbitControls
          enablePan={true}
          minDistance={4}
          maxDistance={15}
          autoRotate={false}
          makeDefault
        />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#00f0ff" />

        <DynamicBlueprint image={image} />
        <SimulationEnvironment />
        <ScanLine />

        <fog attach="fog" args={['#05080a', 8, 20]} />
      </Canvas>
    </div>
  )
}


import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Blueprint3DProps {
  image: HTMLImageElement | null
}

function BottleBlueprint({ image }: { image: HTMLImageElement }) {
  const meshRef = useRef<THREE.Group>(null)
  
  const points = useMemo(() => {
    const pts = []
    const s = 1.0 // Scale factor
    
    // Base
    pts.push(new THREE.Vector2(0, 0))
    pts.push(new THREE.Vector2(0.8 * s, 0))
    
    // Base curve up
    pts.push(new THREE.Vector2(0.85 * s, 0.1 * s))
    pts.push(new THREE.Vector2(0.86 * s, 0.2 * s))
    
    // Main body (slight waist curve)
    for(let i = 0; i <= 10; i++) {
      const t = i / 10
      const y = (0.2 + t * 1.5) * s
      const x = (0.86 - Math.sin(t * Math.PI) * 0.04) * s
      pts.push(new THREE.Vector2(x, y))
    }
    
    // Shoulder
    pts.push(new THREE.Vector2(0.8 * s, 1.8 * s))
    pts.push(new THREE.Vector2(0.7 * s, 1.9 * s))
    pts.push(new THREE.Vector2(0.5 * s, 2.1 * s))
    pts.push(new THREE.Vector2(0.42 * s, 2.2 * s))
    
    // Neck
    pts.push(new THREE.Vector2(0.42 * s, 2.5 * s))
    
    // Cap
    pts.push(new THREE.Vector2(0.47 * s, 2.5 * s))
    pts.push(new THREE.Vector2(0.47 * s, 2.8 * s))
    pts.push(new THREE.Vector2(0.42 * s, 2.85 * s))
    
    // Top
    pts.push(new THREE.Vector2(0, 2.85 * s))

    return pts
  }, [])

  const texture = useMemo(() => {
    if (!image) return null
    const tex = new THREE.Texture(image)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.repeat.set(1, 1)
    tex.needsUpdate = true
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [image])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={meshRef} position={[0, -1.2, 0]}>
        
        {/* Holographic inner bottle with scanned texture mapped */}
        <mesh>
          <latheGeometry args={[points, 64]} />
          <meshStandardMaterial 
            map={texture}
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveMap={texture}
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Outer glowing wireframe shell representing the AI scanning bounds */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <latheGeometry args={[points, 32]} />
          <meshBasicMaterial 
            color="#00ffff" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>

        {/* Base Plate projection indicator */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.4} />
        </mesh>
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
      // Move scanline up and down the bottle height (approx 3 units)
      lineRef.current.position.y = -1.2 + Math.abs(Math.sin(state.clock.getElapsedTime() * 1.5)) * 3.0
    }
  })

  return (
    <mesh ref={lineRef} position={[0, -1.2, 0]}>
      <ringGeometry args={[0.3, 1.3, 32]} />
      <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.6} />
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

      <Canvas shadows dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 1, 6], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[3, 2, 6]} fov={40} />
        <OrbitControls
          enablePan={true}
          minDistance={3}
          maxDistance={12}
          autoRotate={false}
          makeDefault
        />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#00f0ff" />

        <BottleBlueprint image={image} />
        <SimulationEnvironment />
        <ScanLine />

        <fog attach="fog" args={['#05080a', 6, 15]} />
      </Canvas>
    </div>
  )
}


import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function DefaultHologram() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        {/* Core Structure */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 4, 4, 6, 6, 6]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.15} />
        </mesh>
        
        {/* Inner Core */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color="#b026ff" 
            emissive="#b026ff"
            emissiveIntensity={0.8}
            transparent 
            opacity={0.6} 
            wireframe
          />
        </mesh>

        {/* Outer Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#b026ff" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

function SimulationEnvironment() {
  return (
    <>
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={12} size={2} speed={0.5} color="#00f0ff" />
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

export function HeroBlueprint3D() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] bg-cyber-950/50 backdrop-blur-sm relative overflow-hidden rounded-xl border border-neon-cyan/20 group">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded border border-neon-cyan/20 backdrop-blur-sm shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          LIVE DEMO: TOPOLOGY EXTRAPOLATION
        </span>
        <span className="text-[8px] font-mono text-cyber-400 animate-pulse mt-1">
          INTERACTIVE 3D MESH - USE MOUSE TO ORBIT
        </span>
      </div>

      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[6, 4, 10]} fov={40} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={5}
          maxDistance={15}
          autoRotate={true}
          autoRotateSpeed={0.8}
          makeDefault
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
        
        <HeroBlueprint3DContent />
      </Canvas>
    </div>
  )
}

function HeroBlueprint3DContent() {
  return (
    <>
      <DefaultHologram />
      <SimulationEnvironment />
      <fog attach="fog" args={['#05080a', 5, 20]} />
    </>
  )
}

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface Blueprint3DProps {
  image: HTMLImageElement | null
}

function HologramMesh({ image }: { image: HTMLImageElement }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, colors, count, worldW, worldH } = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const maxGridSize = 64
    const aspect = image.width / image.height

    let gridW = maxGridSize
    let gridH = maxGridSize

    if (aspect > 1) {
      gridH = Math.floor(maxGridSize / aspect)
    } else {
      gridW = Math.floor(maxGridSize * aspect)
    }

    canvas.width = gridW
    canvas.height = gridH

    if (ctx) {
      ctx.drawImage(image, 0, 0, gridW, gridH)
      const imgData = ctx.getImageData(0, 0, gridW, gridH).data

      const positions = []
      const colors = []
      let count = 0

      const worldW = 5
      const worldH = 5 / aspect
      const stepX = worldW / gridW
      const stepZ = worldH / gridH

      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const i = (y * gridW + x) * 4
          const r = imgData[i]
          const g = imgData[i + 1]
          const b = imgData[i + 2]

          // Calculate brightness to determine block height
          const brightness = (r + g + b) / (3 * 255)

          // Calculate distance from center to mask out background/sky noise
          const cx = x / gridW - 0.5
          const cy = y / gridH - 0.5
          const distFromCenter = Math.sqrt(cx*cx + cy*cy) * 2

          // Only extrude pixels that are bright enough and near the center of the image
          if (brightness > 0.2 && distFromCenter < 0.85) { 
            // Quantize brightness into 6 distinct "floors" or levels for a structured architectural look
            const levels = 6
            const quantizedBrightness = Math.floor(brightness * levels) / levels
            
            // Central pixels get a slight height boost to form a peak/roof
            const centerBoost = Math.max(0, 0.5 - distFromCenter) * 1.5
            
            const h = (quantizedBrightness * 2.0) + centerBoost + 0.2 // Base height + quantized height + center boost
            const posX = (x - gridW / 2) * stepX + stepX / 2
            const posZ = (y - gridH / 2) * stepZ + stepZ / 2

            positions.push({ x: posX, y: h / 2, z: posZ, h, stepX, stepZ })
            
            // Color based on height to emphasize structure
            const isTall = h > 1.5
            const color = isTall ? new THREE.Color('#b026ff') : new THREE.Color('#00f0ff').lerp(new THREE.Color(`rgb(${r}, ${g}, ${b})`), 0.5)
            colors.push(color)
            count++
          }
        }
      }
      return { positions, colors, count, worldW, worldH }
    }
    return { positions: [], colors: [], count: 0, worldW: 5, worldH: 5 }
  }, [image])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    if (meshRef.current && count > 0) {
      positions.forEach((pos, i) => {
        dummy.position.set(pos.x, pos.y, pos.z)
        dummy.scale.set(pos.stepX * 0.9, pos.h, pos.stepZ * 0.9)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(i, dummy.matrix)
        meshRef.current!.setColorAt(i, colors[i])
      })
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true
      }
    }
  }, [positions, colors, count, dummy])

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle orbit oscillation
      meshRef.current.parent!.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  if (count === 0) return null

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group rotation={[-Math.PI / 4, 0, 0]}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            roughness={0.3}
            metalness={0.8}
            emissive="#00f0ff"
            emissiveIntensity={0.15}
            // @ts-ignore
            vertexColors
          />
        </instancedMesh>

        {/* Foundation Base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[worldW + 0.4, 0.1, worldH + 0.4]} />
          <meshBasicMaterial color="#001122" transparent opacity={0.6} />
        </mesh>

        {/* Glowing Perimeter */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[worldW + 0.4, 0.05, worldH + 0.4]} />
          <meshBasicMaterial wireframe color="#00f0ff" transparent opacity={0.3} />
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
      // Move scanline across the 3D space
      lineRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 2.5
    }
  })

  return (
    <mesh ref={lineRef} position={[0, 0, 1]}>
      <boxGeometry args={[5, 0.05, 0.05]} />
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

        <HologramMesh image={image} />
        <SimulationEnvironment />
        <ScanLine />

        <fog attach="fog" args={['#05080a', 8, 20]} />
      </Canvas>
    </div>
  )
}


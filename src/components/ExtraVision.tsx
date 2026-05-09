import { Shield, Layers, Camera, Crosshair } from 'lucide-react'

export type VisionMode = 'STANDARD' | 'THERMAL' | 'EDGE'

interface ExtraVisionProps {
  mode: VisionMode
  onChangeMode: (mode: VisionMode) => void
}

export function ExtraVision({ mode, onChangeMode }: ExtraVisionProps) {
  return (
    <div className="flex items-center gap-2 bg-cyber-950 rounded-lg p-1.5 border border-cyber-800">
      <div className="flex items-center gap-1.5 pr-2 border-r border-cyber-800">
        <Shield className="w-3.5 h-3.5 text-neon-green" />
        <span className="text-[10px] font-mono text-neon-green">ExtraVision™</span>
      </div>
      
      <div className="flex gap-1">
        <button
          onClick={() => onChangeMode('STANDARD')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
            mode === 'STANDARD' 
              ? 'bg-cyber-800 text-white border border-cyber-600' 
              : 'text-cyber-400 hover:text-cyber-200 hover:bg-cyber-800/50'
          }`}
        >
          <Camera className="w-3 h-3" />
          OPTICAL
        </button>
        <button
          onClick={() => onChangeMode('THERMAL')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
            mode === 'THERMAL' 
              ? 'bg-neon-red/20 text-neon-red border border-neon-red/30' 
              : 'text-cyber-400 hover:text-neon-red hover:bg-neon-red/10'
          }`}
        >
          <Crosshair className="w-3 h-3" />
          THERMAL
        </button>
        <button
          onClick={() => onChangeMode('EDGE')}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-colors ${
            mode === 'EDGE' 
              ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' 
              : 'text-cyber-400 hover:text-neon-purple hover:bg-neon-purple/10'
          }`}
        >
          <Layers className="w-3 h-3" />
          EDGE
        </button>
      </div>
    </div>
  )
}

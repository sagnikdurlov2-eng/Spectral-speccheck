import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Terminal, CheckCircle2, Loader2 } from 'lucide-react'

interface PipelineAgentProps {
  isInspecting: boolean
  isProcessing: boolean
  inspectionCount: number
}

type AgentState = 'IDLE' | 'INGESTING' | 'ANALYZING' | 'REPORTING' | 'ERROR'

export function PipelineAgent({ isInspecting, isProcessing, inspectionCount }: PipelineAgentProps) {
  const [logs, setLogs] = useState<{ id: number; text: string; time: string; type: 'info' | 'success' | 'warn' }[]>([])
  const [agentState, setAgentState] = useState<AgentState>('IDLE')

  const addLog = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs((prev) => {
      const newLog = {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type
      }
      return [newLog, ...prev].slice(0, 5) // Keep last 5 logs
    })
  }

  useEffect(() => {
    if (!isInspecting) {
      setAgentState('IDLE')
      return
    }

    if (isProcessing) {
      setAgentState('ANALYZING')
      addLog('Processing telemetry data...', 'info')
    } else {
      setAgentState('INGESTING')
    }
  }, [isInspecting, isProcessing])

  useEffect(() => {
    if (inspectionCount > 0) {
      addLog(`Inspection #${inspectionCount} completed.`, 'success')
      setAgentState('REPORTING')
      const t = setTimeout(() => {
        if (isInspecting && !isProcessing) {
          setAgentState('INGESTING')
        }
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [inspectionCount])

  const stateColors = {
    IDLE: 'text-cyber-500 bg-cyber-900',
    INGESTING: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/50',
    ANALYZING: 'text-neon-purple bg-neon-purple/10 border-neon-purple/50',
    REPORTING: 'text-neon-green bg-neon-green/10 border-neon-green/50',
    ERROR: 'text-neon-red bg-neon-red/10 border-neon-red/50'
  }

  return (
    <motion.div
      className="glass-panel rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-neon-purple" />
          <h2 className="text-sm font-semibold text-white">Pipeline Agent</h2>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${stateColors[agentState]}`}>
          {agentState}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Visual Pipeline */}
        <div className="relative h-12 flex items-center justify-between px-2">
          {/* Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-cyber-800 z-0">
            {isInspecting && (
              <motion.div 
                className="h-full bg-neon-cyan"
                initial={{ width: '0%' }}
                animate={{ width: agentState === 'REPORTING' ? '100%' : agentState === 'ANALYZING' ? '50%' : '10%' }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          {/* Nodes */}
          {[
            { key: 'INGESTING', label: 'INGEST', icon: <Terminal className="w-3 h-3" /> },
            { key: 'ANALYZING', label: 'ANALYZE', icon: <Activity className="w-3 h-3" /> },
            { key: 'REPORTING', label: 'REPORT', icon: <CheckCircle2 className="w-3 h-3" /> },
          ].map((node) => {
            const isActive = isInspecting && (
              (node.key === 'INGESTING' && ['INGESTING', 'ANALYZING', 'REPORTING'].includes(agentState)) ||
              (node.key === 'ANALYZING' && ['ANALYZING', 'REPORTING'].includes(agentState)) ||
              (node.key === 'REPORTING' && agentState === 'REPORTING')
            )
            const isCurrent = node.key === agentState

            return (
              <div key={node.key} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-cyber-900 transition-colors ${
                  isCurrent ? 'border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]' :
                  isActive ? 'border-neon-green text-neon-green' : 'border-cyber-700 text-cyber-600'
                }`}>
                  {isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : node.icon}
                </div>
                <span className={`text-[8px] font-mono ${isActive ? 'text-cyber-300' : 'text-cyber-600'}`}>
                  {node.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Terminal Logs */}
        <div className="bg-cyber-950 rounded border border-cyber-800 p-2 h-32 overflow-y-auto font-mono text-[10px]">
          {logs.length === 0 ? (
            <div className="text-cyber-600 italic">Agent waiting for start signal...</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex gap-2 mb-1">
                <span className="text-cyber-500 shrink-0">[{log.time}]</span>
                <span className={
                  log.type === 'success' ? 'text-neon-green' :
                  log.type === 'warn' ? 'text-neon-yellow' : 'text-neon-cyan'
                }>{'>'} {log.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

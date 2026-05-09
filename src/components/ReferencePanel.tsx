import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, X, FileImage, Layers } from 'lucide-react'
import type { ImageType } from '../types'

interface ReferencePanelProps {
    referenceImage: HTMLImageElement | null
    onImageLoad: (img: HTMLImageElement, name: string, type: ImageType) => void
    onClearImage: () => void
}

const IMAGE_TYPES: { value: ImageType; label: string }[] = [
    { value: 'blueprint', label: 'Blueprint' },
    { value: 'mockup', label: 'UI Mockup' },
    { value: 'design', label: 'Design' },
    { value: 'photo', label: 'Photo' },
]

export function ReferencePanel({ referenceImage, onImageLoad, onClearImage }: ReferencePanelProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedType, setSelectedType] = useState<ImageType>('design')
    const [imageName, setImageName] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = useCallback(
        (file: File) => {
            if (!file.type.startsWith('image/')) return
            setImageName(file.name)
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = document.createElement('img') as HTMLImageElement
                img.onload = () => onImageLoad(img, file.name, selectedType)
                img.src = e.target?.result as string
            }
            reader.readAsDataURL(file)
        },
        [onImageLoad, selectedType]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
        },
        [handleFile]
    )

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    return (
        <motion.div
            className="glass-panel rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-neon-blue" />
                    <h2 className="text-sm font-semibold text-white">Reference Image</h2>
                </div>
                {referenceImage && (
                    <button
                        onClick={onClearImage}
                        className="p-1 rounded-md hover:bg-glass-hover transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-cyber-300" />
                    </button>
                )}
            </div>

            <div className="p-4">
                <AnimatePresence mode="wait">
                    {referenceImage ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-cyber-800">
                                <img
                                    src={referenceImage.src}
                                    alt="Reference"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neon-blue/20 border border-neon-blue/30">
                                    <span className="text-[10px] font-mono text-neon-blue uppercase">
                                        {selectedType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-cyber-300">
                                <FileImage className="w-3.5 h-3.5" />
                                <span className="truncate">{imageName}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex gap-1.5 mb-3">
                                {IMAGE_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedType(type.value)}
                                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${selectedType === type.value
                                                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                                                : 'bg-glass-white text-cyber-300 border border-transparent hover:bg-glass-hover'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${isDragging
                                        ? 'border-neon-cyan bg-neon-cyan/5'
                                        : 'border-cyber-500 hover:border-cyber-300 hover:bg-glass-white'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-neon-cyan/20' : 'bg-glass-white'
                                    }`}>
                                    {isDragging ? (
                                        <Image className="w-5 h-5 text-neon-cyan" />
                                    ) : (
                                        <Upload className="w-5 h-5 text-cyber-400" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-cyber-300">
                                        {isDragging ? 'Drop image here' : 'Click or drag to upload'}
                                    </p>
                                    <p className="text-[10px] text-cyber-400 mt-1">
                                        PNG, JPG, SVG up to 10MB
                                    </p>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFile(file)
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

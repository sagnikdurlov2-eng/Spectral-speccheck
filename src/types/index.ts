export type ImageType = 'blueprint' | 'mockup' | 'design' | 'photo'
export type InspectionStatus = 'running' | 'completed' | 'failed'
export type DefectType = 'alignment' | 'missing_component' | 'spacing' | 'layout' | 'color'
export type Severity = 'critical' | 'warning' | 'info'

export interface ReferenceImage {
    id: string
    user_id: string
    name: string
    image_url: string
    image_type: ImageType
    width: number
    height: number
    metadata: Record<string, unknown>
    created_at: string
}

export interface Inspection {
    id: string
    user_id: string
    reference_image_id: string | null
    status: InspectionStatus
    alignment_score: number
    overall_score: number
    defect_count: number
    calibration_data: CalibrationData
    snapshot_url: string
    created_at: string
    completed_at: string | null
}

export interface Defect {
    id: string
    inspection_id: string
    defect_type: DefectType
    severity: Severity
    confidence: number
    x: number
    y: number
    width: number
    height: number
    description: string
    metadata: Record<string, unknown>
    created_at: string
}

export interface InspectionReport {
    id: string
    inspection_id: string
    user_id: string
    summary: string
    metrics: ReportMetrics
    recommendations: string[]
    created_at: string
}

export interface CalibrationData {
    perspectiveMatrix: number[]
    scale: { x: number; y: number }
    rotation: number
    offset: { x: number; y: number }
}

export interface ReportMetrics {
    alignmentScore: number
    componentCoverage: number
    spacingAccuracy: number
    colorMatch: number
    layoutFidelity: number
    overallScore: number
}

export interface DetectedDefect {
    type: DefectType
    severity: Severity
    confidence: number
    x: number
    y: number
    width: number
    height: number
    description: string
}

export interface ComparisonResult {
    alignmentScore: number
    overallScore: number
    defects: DetectedDefect[]
    heatmapData: number[][]
    processingTime: number
}

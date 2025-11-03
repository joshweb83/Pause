/**
 * TypeScript types for Pause application
 */

export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Video {
  id: number
  title: string | null
  filename: string
  duration: number | null
  fps: number | null
  width: number | null
  height: number | null
  status: 'uploaded' | 'processing' | 'completed' | 'failed'
  source: 'upload' | 'youtube'
  total_frames: number | null
  extracted_frames: number | null
  created_at: string
}

export interface Archive {
  id: number
  title: string
  description: string | null
  tags: string[]
  total_pages: number
  total_text_length: number
  average_ocr_confidence: number | null
  is_public: boolean
  created_at: string
}

export interface Frame {
  id: number
  frame_number: number
  timestamp: number
  ocr_text: string | null
  ocr_confidence: number | null
  width: number | null
  height: number | null
  notes: string | null
  bookmarked: boolean
}

export interface SearchResult {
  frame_id: number
  frame_number: number
  timestamp: number
  ocr_text: string
  match_context: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

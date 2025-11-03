'use client'

import { useCallback, useState } from 'react'
import { FiUpload, FiX, FiVideo } from 'react-icons/fi'
import clsx from 'clsx'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  accept = 'video/*',
  maxSize = 500,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    setError('')

    // Check file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file')
      return false
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [disabled]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-all',
          dragActive
            ? 'border-pause-500 bg-pause-500/10'
            : 'border-dark-700 hover:border-dark-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-pause-500/10 flex items-center justify-center">
              <FiUpload className="w-8 h-8 text-pause-500" />
            </div>
          </div>

          <div>
            <p className="text-white font-medium">
              {dragActive ? 'Drop video here' : 'Drag and drop your video'}
            </p>
            <p className="text-dark-400 text-sm mt-1">or click to browse</p>
          </div>

          <div className="text-dark-500 text-xs">
            <p>Supported formats: MP4, MOV, AVI, MKV, WebM</p>
            <p>Maximum file size: {maxSize}MB</p>
          </div>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && !error && (
        <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-pause-500/10 flex items-center justify-center">
              <FiVideo className="w-5 h-5 text-pause-500" />
            </div>
            <div>
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-dark-400 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-dark-700 rounded transition-colors"
            disabled={disabled}
          >
            <FiX className="w-5 h-5 text-dark-400" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

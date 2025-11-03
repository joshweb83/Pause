'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import { videosApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiClock } from 'react-icons/fi'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedVideoId, setUploadedVideoId] = useState<number | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setUploadedVideoId(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await videosApi.upload(formData)

      setUploadProgress(100)
      setUploadedVideoId(response.data.id)

      toast.success('Video uploaded successfully! Processing will start shortly.')

      // Reset after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/videos')
      }, 2000)
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(error.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Video</h1>
          <p className="mt-2 text-dark-400">
            Upload a video to extract frames and create a searchable archive
          </p>
        </div>

        {/* Upload Form */}
        <div className="card">
          <FileUpload onFileSelect={handleFileSelect} disabled={uploading} />

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Uploading...</span>
                <span className="text-white font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-pause-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadedVideoId && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-500 font-medium">Upload successful!</p>
                  <p className="text-dark-400 text-sm mt-1">
                    Your video is now being processed. This may take a few minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6 flex items-center space-x-4">
            <Button
              onClick={handleUpload}
              variant="primary"
              disabled={!file || uploading}
              loading={uploading}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload and Process'}
            </Button>

            {file && !uploading && (
              <Button
                onClick={() => setFile(null)}
                variant="ghost"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-dark-900 border border-dark-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-pause-500/10 flex items-center justify-center flex-shrink-0">
                <FiClock className="w-5 h-5 text-pause-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">Processing Time</h3>
                <p className="text-dark-400 text-sm mt-1">
                  Videos are processed at 1 frame per second. A 30-second video will generate about 30 frames.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-dark-900 border border-dark-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-pause-500/10 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-pause-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">What Happens Next?</h3>
                <p className="text-dark-400 text-sm mt-1">
                  We'll extract frames, perform OCR text recognition, and generate a searchable PDF archive.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Processing Steps</h2>
          <div className="space-y-4">
            <ProcessingStep
              number={1}
              title="Frame Extraction"
              description="Extract individual frames from your video at 1 FPS"
            />
            <ProcessingStep
              number={2}
              title="Duplicate Filtering"
              description="Remove duplicate frames using perceptual hashing"
            />
            <ProcessingStep
              number={3}
              title="OCR Analysis"
              description="Extract text from each frame using Tesseract OCR"
            />
            <ProcessingStep
              number={4}
              title="PDF Generation"
              description="Create a searchable PDF with embedded text layer"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ProcessingStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 rounded-full bg-pause-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">{number}</span>
      </div>
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-dark-400 text-sm mt-1">{description}</p>
      </div>
    </div>
  )
}

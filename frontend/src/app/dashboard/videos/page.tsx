'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { videosApi } from '@/lib/api'
import { Video } from '@/types'
import Link from 'next/link'
import { FiVideo, FiTrash2, FiRefreshCw, FiClock } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()

    // Auto-refresh every 10 seconds for processing videos
    const interval = setInterval(() => {
      const hasProcessing = videos.some(v => v.status === 'processing')
      if (hasProcessing) {
        loadVideos()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const loadVideos = async () => {
    try {
      const response = await videosApi.list()
      setVideos(response.data)
    } catch (error) {
      console.error('Failed to load videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This will also delete the associated archive.')) return

    try {
      await videosApi.delete(id)
      setVideos(videos.filter((v) => v.id !== id))
      toast.success('Video deleted')
    } catch (error) {
      console.error('Failed to delete video:', error)
      toast.error('Failed to delete video')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-dark-800 rounded-lg"></div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  const processingVideos = videos.filter((v) => v.status === 'processing')
  const completedVideos = videos.filter((v) => v.status === 'completed')
  const failedVideos = videos.filter((v) => v.status === 'failed')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Videos</h1>
            <p className="mt-2 text-dark-400">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} total
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={loadVideos}>
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/dashboard/upload">
              <Button variant="primary">Upload Video</Button>
            </Link>
          </div>
        </div>

        {/* Processing Videos */}
        {processingVideos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FiClock className="w-5 h-5 mr-2 text-yellow-500" />
              Processing ({processingVideos.length})
            </h2>
            <div className="space-y-3">
              {processingVideos.map((video) => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Videos */}
        {completedVideos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Completed ({completedVideos.length})
            </h2>
            <div className="space-y-3">
              {completedVideos.map((video) => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Failed Videos */}
        {failedVideos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white text-red-500">
              Failed ({failedVideos.length})
            </h2>
            <div className="space-y-3">
              {failedVideos.map((video) => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-16">
            <FiVideo className="w-16 h-16 text-dark-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
            <p className="text-dark-400 mb-6">Upload your first video to get started</p>
            <Link href="/dashboard/upload">
              <Button variant="primary">Upload Video</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function VideoCard({ video, onDelete }: { video: Video; onDelete: (id: number) => void }) {
  const statusColors = {
    uploaded: 'bg-blue-500/10 text-blue-500',
    processing: 'bg-yellow-500/10 text-yellow-500',
    completed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  }

  const statusColor = statusColors[video.status as keyof typeof statusColors] || statusColors.uploaded

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="w-24 h-16 bg-dark-800 rounded flex items-center justify-center flex-shrink-0">
            <FiVideo className="w-8 h-8 text-dark-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">
              {video.title || video.filename}
            </h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-dark-400">
              <span>{video.duration?.toFixed(1)}s</span>
              {video.fps && <span>{video.fps.toFixed(0)} FPS</span>}
              {video.width && video.height && (
                <span>
                  {video.width}x{video.height}
                </span>
              )}
              {video.extracted_frames && (
                <span>{video.extracted_frames} frames extracted</span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                {video.status}
              </span>
              <span className="text-dark-500 text-xs">
                {new Date(video.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {video.status === 'completed' && (
            <Link href={`/dashboard/archives`}>
              <Button variant="ghost" size="sm">
                View Archive
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(video.id)}
            className="text-red-500 hover:text-red-400"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Processing Progress */}
      {video.status === 'processing' && (
        <div className="mt-4 pt-4 border-t border-dark-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-dark-400">Processing frames...</span>
            <span className="text-pause-500">
              {video.extracted_frames || 0} / {video.total_frames || '?'}
            </span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-pause-500 h-full transition-all duration-300"
              style={{
                width: video.total_frames
                  ? `${((video.extracted_frames || 0) / video.total_frames) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { videosApi, archivesApi } from '@/lib/api'
import { Video, Archive } from '@/types'
import Link from 'next/link'
import { FiVideo, FiArchive, FiClock, FiTrendingUp } from 'react-icons/fi'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalArchives: 0,
    processingVideos: 0,
    totalFrames: 0,
  })
  const [recentVideos, setRecentVideos] = useState<Video[]>([])
  const [recentArchives, setRecentArchives] = useState<Archive[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [videosRes, archivesRes] = await Promise.all([
        videosApi.list(),
        archivesApi.list(),
      ])

      const videos = videosRes.data
      const archives = archivesRes.data

      // Calculate stats
      setStats({
        totalVideos: videos.length,
        totalArchives: archives.length,
        processingVideos: videos.filter((v: Video) => v.status === 'processing').length,
        totalFrames: archives.reduce((sum: number, a: Archive) => sum + a.total_pages, 0),
      })

      // Get recent items
      setRecentVideos(videos.slice(0, 5))
      setRecentArchives(archives.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-dark-800 rounded-lg"></div>
          <div className="h-64 bg-dark-800 rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-dark-400">Welcome back! Here's your archive overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Videos"
            value={stats.totalVideos}
            icon={FiVideo}
            color="blue"
          />
          <StatCard
            title="Archives"
            value={stats.totalArchives}
            icon={FiArchive}
            color="purple"
          />
          <StatCard
            title="Processing"
            value={stats.processingVideos}
            icon={FiClock}
            color="yellow"
          />
          <StatCard
            title="Total Frames"
            value={stats.totalFrames}
            icon={FiTrendingUp}
            color="green"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Videos */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Videos</h2>
              <Link href="/dashboard/videos" className="text-pause-500 hover:text-pause-400 text-sm">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentVideos.length === 0 ? (
                <p className="text-dark-500 text-center py-8">No videos yet</p>
              ) : (
                recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{video.title || video.filename}</p>
                      <p className="text-dark-400 text-sm mt-1">
                        {video.status} • {video.duration?.toFixed(1)}s
                      </p>
                    </div>
                    <StatusBadge status={video.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Archives */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Archives</h2>
              <Link href="/dashboard/archives" className="text-pause-500 hover:text-pause-400 text-sm">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentArchives.length === 0 ? (
                <p className="text-dark-500 text-center py-8">No archives yet</p>
              ) : (
                recentArchives.map((archive) => (
                  <Link
                    key={archive.id}
                    href={`/archive/${archive.id}`}
                    className="block p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <p className="text-white font-medium">{archive.title}</p>
                    <p className="text-dark-400 text-sm mt-1">
                      {archive.total_pages} frames • {(archive.average_ocr_confidence || 0).toFixed(1)}% confidence
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/upload"
              className="p-6 bg-pause-600 hover:bg-pause-700 rounded-lg text-center transition-colors"
            >
              <FiVideo className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-medium">Upload Video</p>
              <p className="text-pause-200 text-sm mt-1">Process a new video</p>
            </Link>
            <Link
              href="/dashboard/search"
              className="p-6 bg-dark-800 hover:bg-dark-700 rounded-lg text-center transition-colors"
            >
              <FiArchive className="w-8 h-8 text-pause-500 mx-auto mb-2" />
              <p className="text-white font-medium">Search Archives</p>
              <p className="text-dark-400 text-sm mt-1">Find text in frames</p>
            </Link>
            <Link
              href="/dashboard/archives"
              className="p-6 bg-dark-800 hover:bg-dark-700 rounded-lg text-center transition-colors"
            >
              <FiTrendingUp className="w-8 h-8 text-pause-500 mx-auto mb-2" />
              <p className="text-white font-medium">View Archives</p>
              <p className="text-dark-400 text-sm mt-1">Browse all archives</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    green: 'text-green-500 bg-green-500/10',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    uploaded: 'bg-blue-500/10 text-blue-500',
    processing: 'bg-yellow-500/10 text-yellow-500',
    completed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.uploaded}`}>
      {status}
    </span>
  )
}

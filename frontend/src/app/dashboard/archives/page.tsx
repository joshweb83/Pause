'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { archivesApi } from '@/lib/api'
import { Archive } from '@/types'
import Link from 'next/link'
import { FiSearch, FiDownload, FiShare2, FiTrash2, FiFile } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadArchives()
  }, [])

  const loadArchives = async () => {
    try {
      const response = await archivesApi.list()
      setArchives(response.data)
    } catch (error) {
      console.error('Failed to load archives:', error)
      toast.error('Failed to load archives')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this archive?')) return

    try {
      await archivesApi.delete(id)
      setArchives(archives.filter((a) => a.id !== id))
      toast.success('Archive deleted')
    } catch (error) {
      console.error('Failed to delete archive:', error)
      toast.error('Failed to delete archive')
    }
  }

  const handleDownload = async (id: number, title: string) => {
    try {
      const response = await archivesApi.download(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Download started')
    } catch (error) {
      console.error('Failed to download:', error)
      toast.error('Failed to download PDF')
    }
  }

  const filteredArchives = archives.filter((archive) =>
    archive.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-dark-800 rounded-lg"></div>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Archives</h1>
            <p className="mt-2 text-dark-400">
              {archives.length} {archives.length === 1 ? 'archive' : 'archives'} total
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button variant="primary">Upload New Video</Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-pause-600"
          />
        </div>

        {/* Archives Grid */}
        {filteredArchives.length === 0 ? (
          <div className="text-center py-16">
            <FiFile className="w-16 h-16 text-dark-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No archives found' : 'No archives yet'}
            </h3>
            <p className="text-dark-400 mb-6">
              {searchQuery
                ? 'Try a different search query'
                : 'Upload a video to create your first archive'}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/upload">
                <Button variant="primary">Upload Video</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchives.map((archive) => (
              <ArchiveCard
                key={archive.id}
                archive={archive}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function ArchiveCard({
  archive,
  onDelete,
  onDownload,
}: {
  archive: Archive
  onDelete: (id: number) => void
  onDownload: (id: number, title: string) => void
}) {
  return (
    <div className="card group">
      <Link href={`/archive/${archive.id}`}>
        <div className="aspect-video bg-dark-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
          <FiFile className="w-12 h-12 text-dark-600" />
        </div>
      </Link>

      <div className="space-y-3">
        <Link href={`/archive/${archive.id}`}>
          <h3 className="text-white font-semibold group-hover:text-pause-500 transition-colors line-clamp-2">
            {archive.title}
          </h3>
        </Link>

        {archive.description && (
          <p className="text-dark-400 text-sm line-clamp-2">{archive.description}</p>
        )}

        <div className="flex items-center space-x-4 text-xs text-dark-500">
          <span>{archive.total_pages} frames</span>
          {archive.average_ocr_confidence && (
            <span>{archive.average_ocr_confidence.toFixed(1)}% OCR</span>
          )}
        </div>

        {archive.tags && archive.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {archive.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-dark-800 text-dark-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 pt-3 border-t border-dark-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(archive.id, archive.title)}
            className="flex-1"
          >
            <FiDownload className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(archive.id)}
            className="text-red-500 hover:text-red-400"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

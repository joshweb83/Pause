'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { archivesApi } from '@/lib/api'
import { Archive, Frame } from '@/types'
import { PDFViewer } from '@/components/viewer/PDFViewer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiDownload,
  FiShare2,
  FiSearch,
  FiGrid,
  FiList,
  FiEdit,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ArchiveViewerPage() {
  const params = useParams()
  const router = useRouter()
  const archiveId = parseInt(params.id as string)

  const [archive, setArchive] = useState<Archive | null>(null)
  const [frames, setFrames] = useState<Frame[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'pdf' | 'grid'>('pdf')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadArchive()
    loadFrames()
  }, [archiveId])

  const loadArchive = async () => {
    try {
      const response = await archivesApi.get(archiveId)
      setArchive(response.data)
    } catch (error) {
      console.error('Failed to load archive:', error)
      toast.error('Failed to load archive')
      router.push('/dashboard/archives')
    }
  }

  const loadFrames = async () => {
    try {
      const response = await archivesApi.getFrames(archiveId, 1, 100)
      setFrames(response.data)
    } catch (error) {
      console.error('Failed to load frames:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!archive) return

    try {
      const response = await archivesApi.download(archiveId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${archive.title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Download started')
    } catch (error) {
      console.error('Failed to download:', error)
      toast.error('Failed to download PDF')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await archivesApi.search(archiveId, searchQuery)
      setSearchResults(response.data)
      toast.success(`Found ${response.data.length} results`)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  if (loading || !archive) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-pause-500 text-xl">Loading archive...</div>
      </div>
    )
  }

  const pdfUrl = archive.pdf_path ? `${process.env.NEXT_PUBLIC_API_URL}${archive.pdf_path}` : ''

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/archives">
                <Button variant="ghost" size="sm">
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{archive.title}</h1>
                <p className="text-dark-400 text-sm">
                  {archive.total_pages} frames • {archive.average_ocr_confidence?.toFixed(1)}% OCR confidence
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-3 py-1.5 rounded ${
                    viewMode === 'pdf' ? 'bg-pause-600 text-white' : 'text-dark-400'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-pause-600 text-white' : 'text-dark-400'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
              </div>

              <Button variant="ghost" size="sm">
                <FiEdit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <FiShare2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownload}>
                <FiDownload className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="relative flex-1 max-w-2xl">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search text in frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-pause-600"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSearch}
              loading={searching}
              disabled={!searchQuery.trim() || searching}
            >
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-3 p-3 bg-dark-800 rounded-lg">
              <p className="text-pause-500 text-sm font-medium mb-2">
                {searchResults.length} results found
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((result: any) => (
                  <div
                    key={result.frame_id}
                    className="p-2 bg-dark-900 rounded hover:bg-dark-700 cursor-pointer"
                  >
                    <p className="text-white text-sm">
                      Frame {result.frame_number} • {result.timestamp.toFixed(1)}s
                    </p>
                    <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                      {result.match_context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="h-[calc(100vh-200px)]">
        {viewMode === 'pdf' && pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} onDownload={handleDownload} />
        ) : (
          <FrameGridView frames={frames} archiveId={archiveId} />
        )}
      </div>
    </div>
  )
}

function FrameGridView({ frames, archiveId }: { frames: Frame[]; archiveId: number }) {
  if (frames.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-dark-500">No frames available</p>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {frames.map((frame) => (
          <Link
            key={frame.id}
            href={`/archive/${archiveId}/frame/${frame.id}`}
            className="group"
          >
            <div className="aspect-video bg-dark-800 rounded-lg overflow-hidden mb-2 group-hover:ring-2 group-hover:ring-pause-500 transition-all">
              {/* Frame thumbnail would go here */}
              <div className="w-full h-full flex items-center justify-center text-dark-600">
                Frame {frame.frame_number}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white text-sm font-medium">
                Frame {frame.frame_number}
              </p>
              <p className="text-dark-500 text-xs">
                {frame.timestamp.toFixed(1)}s • {frame.ocr_confidence?.toFixed(0)}% confidence
              </p>
              {frame.ocr_text && (
                <p className="text-dark-400 text-xs line-clamp-2">
                  {frame.ocr_text.substring(0, 100)}...
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

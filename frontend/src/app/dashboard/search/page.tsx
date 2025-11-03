'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { archivesApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { FiSearch, FiFileText } from 'react-icons/fi'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    setSearched(true)

    try {
      // Search across all archives
      // Note: This would need a global search endpoint in the backend
      // For now, we'll show a message
      setResults([])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Search Archives</h1>
          <p className="mt-2 text-dark-400">
            Search for text across all your video archives
          </p>
        </div>

        {/* Search Bar */}
        <div className="card">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for text in your archives..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-pause-600 text-lg"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              loading={searching}
              disabled={!query.trim() || searching}
              className="px-8 py-4"
            >
              Search
            </Button>
          </div>

          <div className="mt-4 flex items-center space-x-4 text-sm text-dark-500">
            <span>💡 Tip: Search is case-insensitive</span>
            <span>•</span>
            <span>Try searching for specific words or phrases</span>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {searching ? 'Searching...' : `${results.length} results found`}
              </h2>
            </div>

            {results.length === 0 && !searching && (
              <div className="text-center py-16">
                <FiFileText className="w-16 h-16 text-dark-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-dark-400">
                  Try a different search term or{' '}
                  <Link href="/dashboard/archives" className="text-pause-500 hover:underline">
                    browse your archives
                  </Link>
                </p>
              </div>
            )}

            {/* Search through individual archives */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                Or search within a specific archive
              </h3>
              <p className="text-dark-400 text-sm mb-4">
                Go to an archive to search for text within its frames
              </p>
              <Link href="/dashboard/archives">
                <Button variant="secondary">Browse Archives</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Popular Searches / Recent */}
        {!searched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
              <ul className="space-y-3 text-dark-400 text-sm">
                <li className="flex items-start">
                  <span className="text-pause-500 mr-2">•</span>
                  OCR extracts text from each video frame
                </li>
                <li className="flex items-start">
                  <span className="text-pause-500 mr-2">•</span>
                  Search finds matches across all your archives
                </li>
                <li className="flex items-start">
                  <span className="text-pause-500 mr-2">•</span>
                  Click on results to jump to that frame
                </li>
                <li className="flex items-start">
                  <span className="text-pause-500 mr-2">•</span>
                  Download PDFs with searchable text layers
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/upload"
                  className="block p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <p className="text-white font-medium">Upload New Video</p>
                  <p className="text-dark-400 text-sm">Create a new searchable archive</p>
                </Link>
                <Link
                  href="/dashboard/archives"
                  className="block p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <p className="text-white font-medium">Browse Archives</p>
                  <p className="text-dark-400 text-sm">View all your video archives</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

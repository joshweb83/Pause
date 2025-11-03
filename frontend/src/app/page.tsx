'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiPlay, FiArchive, FiSearch, FiDownload, FiLock } from 'react-icons/fi'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-pause-500 text-2xl font-bold">⏸</div>
            <span className="text-2xl font-bold text-white">Pause</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/login" className="btn-ghost">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 text-white">
            Transform Videos Into
            <span className="text-pause-500"> Searchable Archives</span>
          </h1>
          <p className="text-xl text-dark-300 mb-12 max-w-2xl mx-auto">
            Extract frames from YouTube Shorts or videos, perform OCR analysis,
            and browse them like a PDF with full-text search capabilities.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Start Archiving
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32"
        >
          <FeatureCard
            icon={<FiPlay />}
            title="Video Input"
            description="Upload videos or paste YouTube Shorts URLs for instant processing"
          />
          <FeatureCard
            icon={<FiArchive />}
            title="Frame Extraction"
            description="Automatic frame extraction with duplicate detection and scene analysis"
          />
          <FeatureCard
            icon={<FiSearch />}
            title="OCR & Search"
            description="Full-text search across all frames with OCR text extraction"
          />
          <FeatureCard
            icon={<FiDownload />}
            title="PDF Export"
            description="Download as searchable PDF with embedded text layer"
          />
          <FeatureCard
            icon={<FiLock />}
            title="Private Vault"
            description="Secure personal archive with sharing capabilities"
          />
          <FeatureCard
            icon={<FiArchive />}
            title="Smart Tagging"
            description="AI-powered tagging and content categorization"
          />
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number={1} title="Upload" description="Upload video or paste URL" />
            <StepCard number={2} title="Process" description="Extract frames & run OCR" />
            <StepCard number={3} title="Browse" description="View like a PDF document" />
            <StepCard number={4} title="Export" description="Download searchable PDF" />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-32 border-t border-dark-800">
        <div className="text-center text-dark-500">
          <p>© 2024 Pause - Visual Archive System</p>
          <p className="mt-2 text-sm">calm · precise · archival · cinematic</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card group hover:border-pause-600 cursor-pointer">
      <div className="text-pause-500 text-3xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="relative">
      <div className="w-16 h-16 bg-pause-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400 text-sm">{description}</p>
    </div>
  )
}

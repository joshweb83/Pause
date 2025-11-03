'use client'

import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload } from 'react-icons/fi'
import { Button } from '../ui/Button'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
  onDownload?: () => void
}

export function PDFViewer({ pdfUrl, onDownload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset
      return Math.max(1, Math.min(newPage, numPages))
    })
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 3.0))
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Keyboard navigation
  React.useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') previousPage()
      if (e.key === 'ArrowRight') nextPage()
      if (e.key === '+' && e.ctrlKey) {
        e.preventDefault()
        zoomIn()
      }
      if (e.key === '-' && e.ctrlKey) {
        e.preventDefault()
        zoomOut()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [numPages])

  return (
    <div className="flex flex-col h-full bg-dark-900">
      {/* Toolbar */}
      <div className="bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousPage}
            disabled={pageNumber <= 1}
          >
            <FiChevronLeft />
          </Button>
          <span className="text-dark-300 text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
          >
            <FiChevronRight />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <FiZoomOut />
          </Button>
          <span className="text-dark-300 text-sm w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <FiZoomIn />
          </Button>
        </div>

        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload}>
            <FiDownload className="mr-2" />
            Download
          </Button>
        )}
      </div>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-dark-400 text-center">
              Loading PDF...
            </div>
          }
          error={
            <div className="text-red-500 text-center">
              Failed to load PDF
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl"
          />
        </Document>
      </div>

      {/* Navigation hint */}
      <div className="bg-dark-800 border-t border-dark-700 p-2 text-center text-dark-500 text-xs">
        Use ← → arrow keys to navigate • Ctrl + / - to zoom
      </div>
    </div>
  )
}

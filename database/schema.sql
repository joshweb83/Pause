-- Pause Visual Archive System - Database Schema
-- PostgreSQL 15+

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    duration FLOAT,
    fps FLOAT,
    width INTEGER,
    height INTEGER,
    source VARCHAR(50) DEFAULT 'upload',
    source_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'uploaded',
    error_message TEXT,
    total_frames INTEGER,
    extracted_frames INTEGER,
    unique_frames INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_videos_owner ON videos(owner_id);
CREATE INDEX idx_videos_status ON videos(status);

-- Archives table
CREATE TABLE IF NOT EXISTS archives (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id INTEGER NOT NULL UNIQUE REFERENCES videos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSONB DEFAULT '[]',
    pdf_path VARCHAR(500),
    pdf_size BIGINT,
    total_pages INTEGER DEFAULT 0,
    total_text_length INTEGER DEFAULT 0,
    average_ocr_confidence FLOAT,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_archives_owner ON archives(owner_id);
CREATE INDEX idx_archives_video ON archives(video_id);
CREATE INDEX idx_archives_share_token ON archives(share_token);
CREATE INDEX idx_archives_tags ON archives USING GIN(tags);

-- Frames table
CREATE TABLE IF NOT EXISTS frames (
    id SERIAL PRIMARY KEY,
    archive_id INTEGER NOT NULL REFERENCES archives(id) ON DELETE CASCADE,
    frame_number INTEGER NOT NULL,
    timestamp FLOAT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    ocr_text TEXT,
    ocr_confidence FLOAT,
    ocr_data JSONB,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    notes TEXT,
    bookmarked BOOLEAN DEFAULT FALSE,
    ai_summary TEXT,
    ai_tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_frames_archive ON frames(archive_id);
CREATE INDEX idx_frames_number ON frames(archive_id, frame_number);
CREATE INDEX idx_frames_bookmarked ON frames(archive_id, bookmarked) WHERE bookmarked = TRUE;

-- Full-text search index for OCR text
CREATE INDEX idx_frames_ocr_text ON frames USING GIN(to_tsvector('english', COALESCE(ocr_text, '')));

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_archives_updated_at BEFORE UPDATE ON archives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frames_updated_at BEFORE UPDATE ON frames
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample queries for reference
--
-- Search frames by text:
-- SELECT f.*, a.title
-- FROM frames f
-- JOIN archives a ON f.archive_id = a.id
-- WHERE to_tsvector('english', f.ocr_text) @@ to_tsquery('english', 'search_term');
--
-- Get archive statistics:
-- SELECT
--     a.id,
--     a.title,
--     COUNT(f.id) as total_frames,
--     SUM(LENGTH(f.ocr_text)) as total_text,
--     AVG(f.ocr_confidence) as avg_confidence
-- FROM archives a
-- LEFT JOIN frames f ON a.id = f.archive_id
-- GROUP BY a.id, a.title;

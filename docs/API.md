# Pause API Documentation

REST API documentation for Pause Visual Archive System.

Base URL: `http://localhost:8000/api/v1`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Health

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "Pause API",
  "version": "1.0.0"
}
```

### Users

#### POST /users/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /users/login
Login and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

#### GET /users/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Videos

#### POST /videos/upload
Upload a video file for processing.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Video file (mp4, mov, avi, mkv, webm)

**Response:** `201 Created`
```json
{
  "id": 1,
  "filename": "video.mp4",
  "status": "uploaded",
  "message": "Video uploaded successfully and is being processed"
}
```

#### GET /videos
List all videos for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "title": "video.mp4",
    "filename": "uuid_video.mp4",
    "duration": 30.5,
    "fps": 30.0,
    "width": 1920,
    "height": 1080,
    "status": "completed",
    "source": "upload",
    "total_frames": 915,
    "extracted_frames": 30,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /videos/{video_id}
Get video details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "title": "video.mp4",
  ...
}
```

#### DELETE /videos/{video_id}
Delete a video.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

### Archives

#### GET /archives
List all archives for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Archive 1",
    "description": "My first archive",
    "tags": ["important", "work"],
    "total_pages": 30,
    "total_text_length": 5000,
    "average_ocr_confidence": 85.5,
    "is_public": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /archives/{archive_id}
Get archive details.

**Headers:** `Authorization: Bearer <token>`

#### PUT /archives/{archive_id}
Update archive metadata.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["tag1", "tag2"]
}
```

#### DELETE /archives/{archive_id}
Delete an archive.

**Headers:** `Authorization: Bearer <token>`

#### GET /archives/{archive_id}/frames
Get frames for an archive (paginated).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)

**Response:**
```json
[
  {
    "id": 1,
    "frame_number": 0,
    "timestamp": 0.0,
    "ocr_text": "Hello World",
    "ocr_confidence": 92.5,
    "width": 1920,
    "height": 1080,
    "notes": null,
    "bookmarked": false
  }
]
```

#### GET /archives/{archive_id}/frames/{frame_id}
Get specific frame details.

#### PUT /archives/{archive_id}/frames/{frame_id}
Update frame (add notes, bookmark).

**Request Body:**
```json
{
  "notes": "Important frame",
  "bookmarked": true
}
```

#### GET /archives/{archive_id}/download
Download archive as PDF.

**Headers:** `Authorization: Bearer <token>`

**Response:** PDF file download

#### GET /archives/{archive_id}/search
Search text within archive frames.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `query` (required): Search term

**Response:**
```json
[
  {
    "frame_id": 1,
    "frame_number": 0,
    "timestamp": 0.0,
    "ocr_text": "Full OCR text...",
    "match_context": "...matched text context..."
  }
]
```

#### POST /archives/{archive_id}/share
Create a shareable link for archive.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "share_token": "abc123...",
  "share_url": "http://localhost:3000/archive/shared/abc123..."
}
```

#### DELETE /archives/{archive_id}/share
Revoke share link for archive.

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Examples

### Upload and Process Video

```bash
# 1. Register
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Save the access_token from response

# 2. Upload video
curl -X POST http://localhost:8000/api/v1/videos/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/video.mp4"

# 3. Check video status
curl http://localhost:8000/api/v1/videos/1 \
  -H "Authorization: Bearer <access_token>"

# 4. Once completed, get archive
curl http://localhost:8000/api/v1/archives/1 \
  -H "Authorization: Bearer <access_token>"

# 5. Download PDF
curl http://localhost:8000/api/v1/archives/1/download \
  -H "Authorization: Bearer <access_token>" \
  -o archive.pdf

# 6. Search in archive
curl "http://localhost:8000/api/v1/archives/1/search?query=hello" \
  -H "Authorization: Bearer <access_token>"
```

## Interactive API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI documentation.
Visit http://localhost:8000/redoc for ReDoc documentation.

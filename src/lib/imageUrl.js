// src/lib/imageUrl.js
// Helper to generate image URLs that work with local, ngrok, and production environments

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Get the base URL for the backend (without /api suffix)
 */
export function getBackendBaseUrl() {
  // Remove /api suffix if present
  return API_URL.replace(/\/api\/?$/, '');
}

/**
 * Generate a full URL for a backend image/file path
 * @param {string} path - The relative path from storage (e.g., "venue_photos/image.jpg")
 * @returns {string} Full URL to the image
 */
export function getStorageUrl(path) {
  if (!path) return null;
  
  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const baseUrl = getBackendBaseUrl();
  
  // Handle paths that start with /storage/
  if (path.startsWith('/storage/')) {
    return `${baseUrl}${path}`;
  }
  
  // Handle paths that start with storage/
  if (path.startsWith('storage/')) {
    return `${baseUrl}/${path}`;
  }
  
  // Assume the path is relative to public storage
  return `${baseUrl}/storage/${path}`;
}

/**
 * Get a placeholder image URL
 * @param {string} type - Type of placeholder ('venue', 'user', 'event', 'document')
 * @param {number} id - Optional ID for consistent random placeholder
 */
export function getPlaceholder(type = 'default', id = 1) {
  const placeholders = {
    venue: '/img/home-decor-1.jpeg',
    user: '/img/team-1.jpeg',
    event: '/img/home-decor-2.jpeg',
    document: '/img/home-decor-3.jpeg',
    default: '/img/home-decor-1.jpeg',
  };
  
  return placeholders[type] || placeholders.default;
}

/**
 * Get venue photo URL with fallback
 * @param {object} venue - Venue object with photos array
 * @returns {string} URL to venue photo or placeholder
 */
export function getVenuePhotoUrl(venue) {
  if (venue?.photos?.length > 0) {
    const photo = venue.photos[0];
    const path = photo.image_path || photo.path || photo.url;
    if (path) {
      return getStorageUrl(path);
    }
  }
  return getPlaceholder('venue', venue?.id);
}

/**
 * Get user avatar URL with fallback
 * @param {object} user - User object with avatar or profile_photo field
 * @returns {string} URL to user avatar or placeholder
 */
export function getUserAvatarUrl(user) {
  // Check both profile_photo (database field) and avatar (legacy/alternative)
  const photo = user?.profile_photo || user?.avatar;
  if (photo) {
    return getStorageUrl(photo);
  }
  return getPlaceholder('user', user?.id);
}

/**
 * Get document file URL
 * @param {object} document - Document object with file_url (full URL) or file_path (relative path) field
 * @returns {string} URL to document file
 */
export function getDocumentFileUrl(document) {
  // API returns file_url as full URL (may be ngrok URL) - use it directly
  if (document?.file_url) {
    return document.file_url;
  }
  // Fallback to file_path if file_url not available
  if (document?.file_path) {
    return getStorageUrl(document.file_path);
  }
  return null;
}

export default {
  getBackendBaseUrl,
  getStorageUrl,
  getPlaceholder,
  getVenuePhotoUrl,
  getUserAvatarUrl,
  getDocumentFileUrl,
};


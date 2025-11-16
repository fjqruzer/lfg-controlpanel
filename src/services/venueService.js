// Venue Service
// This service layer handles all venue-related data operations
// Currently uses mock data - replace with real API calls when backend is ready

import { mockVenues } from "@/data/mockVenues";
import { apiClient } from "@/lib/apiClient";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Get all venues
 * @returns {Promise<Array>} Array of venue objects
 */
export const getVenues = async () => {
  if (USE_MOCK) {
    return mockVenues;
  }
  // Backend: GET /venues (with optional filters/pagination)
  return apiClient.get("/venues");
};

/**
 * Get a single venue by slug
 * @param {string} slug - Venue slug
 * @returns {Promise<Object|null>} Venue object or null if not found
 */
export const getVenueBySlug = async (slug) => {
  if (USE_MOCK) {
    return mockVenues.find((venue) => venue.slug === slug) || null;
  }
  // Slug is mock-only; real API uses ID routes.
  return null;
};

/**
 * Get a single venue by ID
 * @param {number} id - Venue ID
 * @returns {Promise<Object|null>} Venue object or null if not found
 */
export const getVenueById = async (id) => {
  if (USE_MOCK) {
    return mockVenues.find((venue) => venue.id === id) || null;
  }
  return apiClient.get(`/venues/show/${id}`);
};

/**
 * Create a new venue
 * @param {Object} venueData - Venue data
 * @returns {Promise<Object>} Created venue object
 */
export const createVenue = async (venueData) => {
  if (USE_MOCK) {
    const newVenue = {
      id: Date.now(),
      ...venueData,
      createdDate: new Date().toISOString().split("T")[0],
    };
    return newVenue;
  }
  return apiClient.post("/venues/create", venueData);
};

/**
 * Update an existing venue
 * @param {number} id - Venue ID
 * @param {Object} updates - Updated venue data
 * @returns {Promise<Object>} Updated venue object
 */
export const updateVenue = async (id, updates) => {
  if (USE_MOCK) {
    const venue = mockVenues.find((v) => v.id === id);
    if (!venue) throw new Error("Venue not found");
    return { ...venue, ...updates };
  }
  return apiClient.post(`/venues/edit/${id}`, updates);
};

/**
 * Delete a venue
 * @param {number} id - Venue ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteVenue = async (id) => {
  if (USE_MOCK) {
    return true;
  }
  return apiClient.del(`/venues/delete/${id}`);
};

/**
 * Filter venues by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered venues
 */
export const filterVenues = async (filters) => {
  if (USE_MOCK) {
    let filtered = [...mockVenues];

    if (filters.region && filters.region !== "All") {
      filtered = filtered.filter((v) => v.region === filters.region);
    }

    if (filters.sportType && filters.sportType !== "All") {
      filtered = filtered.filter((v) => v.sportType === filters.sportType);
    }

    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.address.toLowerCase().includes(query) ||
          v.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // For real API, delegate to getVenues; keep this for backwards compatibility
  return getVenues(filters);
};

// Note: getVenues returns raw mock data in mock mode, or the Laravel
// paginator response in real mode: { data: T[], meta, links? }.


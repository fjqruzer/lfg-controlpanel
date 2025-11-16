// Venue Service
// This service layer handles all venue-related data operations
// Currently uses mock data - replace with real API calls when backend is ready

import { mockVenues } from '@/data/mockVenues';

// Simulate API delay for realistic behavior
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all venues
 * @returns {Promise<Array>} Array of venue objects
 */
export const getVenues = async () => {
  await delay();
  return mockVenues;
};

/**
 * Get a single venue by slug
 * @param {string} slug - Venue slug
 * @returns {Promise<Object|null>} Venue object or null if not found
 */
export const getVenueBySlug = async (slug) => {
  await delay();
  return mockVenues.find(venue => venue.slug === slug) || null;
};

/**
 * Get a single venue by ID
 * @param {number} id - Venue ID
 * @returns {Promise<Object|null>} Venue object or null if not found
 */
export const getVenueById = async (id) => {
  await delay();
  return mockVenues.find(venue => venue.id === id) || null;
};

/**
 * Create a new venue
 * @param {Object} venueData - Venue data
 * @returns {Promise<Object>} Created venue object
 */
export const createVenue = async (venueData) => {
  await delay();
  // In real implementation, this would POST to API
  const newVenue = {
    id: Date.now(),
    ...venueData,
    createdDate: new Date().toISOString().split('T')[0]
  };
  return newVenue;
};

/**
 * Update an existing venue
 * @param {number} id - Venue ID
 * @param {Object} updates - Updated venue data
 * @returns {Promise<Object>} Updated venue object
 */
export const updateVenue = async (id, updates) => {
  await delay();
  // In real implementation, this would PUT/PATCH to API
  const venue = mockVenues.find(v => v.id === id);
  if (!venue) throw new Error('Venue not found');
  return { ...venue, ...updates };
};

/**
 * Delete a venue
 * @param {number} id - Venue ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteVenue = async (id) => {
  await delay();
  // In real implementation, this would DELETE to API
  return true;
};

/**
 * Filter venues by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered venues
 */
export const filterVenues = async (filters) => {
  await delay();
  let filtered = [...mockVenues];

  if (filters.region && filters.region !== 'All') {
    filtered = filtered.filter(v => v.region === filters.region);
  }

  if (filters.sportType && filters.sportType !== 'All') {
    filtered = filtered.filter(v => v.sportType === filters.sportType);
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(v => v.status === filters.status);
  }

  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query) ||
      v.city.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// When ready to connect to real API, replace implementations like this:
/*
export const getVenues = async () => {
  const response = await fetch('/api/venues');
  if (!response.ok) throw new Error('Failed to fetch venues');
  return response.json();
};

export const getVenueBySlug = async (slug) => {
  const response = await fetch(`/api/venues/${slug}`);
  if (!response.ok) throw new Error('Venue not found');
  return response.json();
};
*/

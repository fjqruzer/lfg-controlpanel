// Event Service
// This service layer handles all event-related data operations
// Currently uses mock data - replace with real API calls when backend is ready

import { mockEvents } from '@/data/mockEvents';

// Simulate API delay for realistic behavior
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all events
 * @returns {Promise<Array>} Array of event objects
 */
export const getEvents = async () => {
  await delay();
  return mockEvents;
};

/**
 * Get a single event by slug
 * @param {string} slug - Event slug
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export const getEventBySlug = async (slug) => {
  await delay();
  return mockEvents.find(event => event.slug === slug) || null;
};

/**
 * Get a single event by ID
 * @param {number} id - Event ID
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export const getEventById = async (id) => {
  await delay();
  return mockEvents.find(event => event.id === id) || null;
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event object
 */
export const createEvent = async (eventData) => {
  await delay();
  // In real implementation, this would POST to API
  const newEvent = {
    id: Date.now(),
    ...eventData,
    createdDate: new Date().toISOString().split('T')[0]
  };
  return newEvent;
};

/**
 * Update an existing event
 * @param {number} id - Event ID
 * @param {Object} updates - Updated event data
 * @returns {Promise<Object>} Updated event object
 */
export const updateEvent = async (id, updates) => {
  await delay();
  // In real implementation, this would PUT/PATCH to API
  const event = mockEvents.find(e => e.id === id);
  if (!event) throw new Error('Event not found');
  return { ...event, ...updates };
};

/**
 * Delete an event
 * @param {number} id - Event ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteEvent = async (id) => {
  await delay();
  // In real implementation, this would DELETE to API
  return true;
};

/**
 * Filter events by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered events
 */
export const filterEvents = async (filters) => {
  await delay();
  let filtered = [...mockEvents];

  if (filters.eventType && filters.eventType !== 'All') {
    filtered = filtered.filter(e => e.eventType === filters.eventType);
  }

  if (filters.sport && filters.sport !== 'All') {
    filtered = filtered.filter(e => e.sport === filters.sport);
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(e => e.status === filters.status);
  }

  if (filters.venue && filters.venue !== 'All') {
    filtered = filtered.filter(e => e.venue.name === filters.venue);
  }

  if (filters.date) {
    filtered = filtered.filter(e => e.date === filters.date);
  }

  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.host.fullName.toLowerCase().includes(query) ||
      e.venue.name.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// When ready to connect to real API, replace implementations like this:
/*
export const getEvents = async () => {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

export const getEventBySlug = async (slug) => {
  const response = await fetch(`/api/events/${slug}`);
  if (!response.ok) throw new Error('Event not found');
  return response.json();
};
*/

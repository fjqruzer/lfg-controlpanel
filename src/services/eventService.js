// Event Service
// This service layer handles all event-related data operations
// Currently uses mock data - replace with real API calls when backend is ready

import { mockEvents } from "@/data/mockEvents";
import { apiClient } from "@/lib/apiClient";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Get all events
 * @returns {Promise<Array>} Array of event objects
 */
export const getEvents = async (filters = {}) => {
  if (USE_MOCK) {
    return mockEvents;
  }
  // Laravel: GET /events with filters (q, sport, venue_id, date_from, date_to, page, per_page)
  return apiClient.get("/events", filters);
};

/**
 * Get a single event by slug
 * @param {string} slug - Event slug
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export const getEventBySlug = async (slug) => {
  if (USE_MOCK) {
    return mockEvents.find((event) => event.slug === slug) || null;
  }
  // if backend uses id-based route, slug handling may be different; keep mock-only for now
  return null;
};

/**
 * Get a single event by ID
 * @param {number} id - Event ID
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export const getEventById = async (id) => {
  if (USE_MOCK) {
    return mockEvents.find((event) => event.id === id) || null;
  }
  return apiClient.get(`/events/${id}`);
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event object
 */
export const createEvent = async (eventData) => {
  if (USE_MOCK) {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdDate: new Date().toISOString().split("T")[0],
    };
    return newEvent;
  }
  // Backend: POST /events/create
  return apiClient.post("/events/create", eventData);
};

/**
 * Update an existing event
 * @param {number} id - Event ID
 * @param {Object} updates - Updated event data
 * @returns {Promise<Object>} Updated event object
 */
export const updateEvent = async (id, updates) => {
  if (USE_MOCK) {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");
    return { ...event, ...updates };
  }
  // Backend guide prefers PUT /events/{id}
  return apiClient.patch(`/events/${id}`, updates);
};

/**
 * Delete an event
 * @param {number} id - Event ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteEvent = async (id) => {
  if (USE_MOCK) {
    return true;
  }
  return apiClient.del(`/events/${id}`);
};

/**
 * Filter events by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered events
 */
export const filterEvents = async (filters) => {
  if (USE_MOCK) {
    let filtered = [...mockEvents];

    if (filters.eventType && filters.eventType !== "All") {
      filtered = filtered.filter((e) => e.eventType === filters.eventType);
    }

    if (filters.sport && filters.sport !== "All") {
      filtered = filtered.filter((e) => e.sport === filters.sport);
    }

    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    if (filters.venue && filters.venue !== "All") {
      filtered = filtered.filter((e) => e.venue.name === filters.venue);
    }

    if (filters.date) {
      filtered = filtered.filter((e) => e.date === filters.date);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.host.fullName.toLowerCase().includes(query) ||
          e.venue.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // For real API, use getEvents with filters; this function remains for backwards compatibility
  return getEvents(filters);
};

// Note: getEvents returns raw mock data in mock mode, or the Laravel
// paginator response in real mode: { data: T[], meta, links? }.


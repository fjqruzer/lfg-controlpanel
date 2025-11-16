# Service Layer

This directory contains the service layer for the LFG Dashboard application. The service layer acts as an abstraction between the UI components and data sources.

## Current Implementation

Currently, all services use **mock data** for frontend development. This allows you to build and test the UI without a backend.

## Structure

```
src/services/
├── eventService.js    # Event-related operations
├── venueService.js    # Venue-related operations
└── index.js          # Central export point
```

## Usage

Import services in your components:

```javascript
import { getEvents, getEventBySlug } from '@/services/eventService';
import { getVenues, createVenue } from '@/services/venueService';

// In your component
useEffect(() => {
  const loadData = async () => {
    const events = await getEvents();
    setEvents(events);
  };
  loadData();
}, []);
```

## Transitioning to Real API

When your backend is ready, you only need to update the service files. The components won't need any changes.

### Example: Converting to Real API

**Before (Mock):**
```javascript
export const getEvents = async () => {
  await delay();
  return mockEvents;
};
```

**After (Real API):**
```javascript
export const getEvents = async () => {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};
```

## Benefits

- **Single source of truth** - All data access goes through services
- **Easy testing** - Mock services for unit tests
- **Realistic behavior** - Simulated delays match real API calls
- **Clean separation** - UI components don't know about data source
- **Simple migration** - Change service implementation, not components

## Available Services

### Event Service
- `getEvents()` - Get all events
- `getEventBySlug(slug)` - Get event by slug
- `getEventById(id)` - Get event by ID
- `createEvent(data)` - Create new event
- `updateEvent(id, updates)` - Update event
- `deleteEvent(id)` - Delete event
- `filterEvents(filters)` - Filter events by criteria

### Venue Service
- `getVenues()` - Get all venues
- `getVenueBySlug(slug)` - Get venue by slug
- `getVenueById(id)` - Get venue by ID
- `createVenue(data)` - Create new venue
- `updateVenue(id, updates)` - Update venue
- `deleteVenue(id)` - Delete venue
- `filterVenues(filters)` - Filter venues by criteria

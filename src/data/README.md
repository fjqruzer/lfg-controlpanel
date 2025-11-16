# Mock Data

This directory contains all mock data used for frontend development.

## Files

- **mockEvents.js** - Event data with participants, teams, check-ins, etc.
- **mockVenues.js** - Venue data with facilities, reviews, revenue, etc.

## Usage

**Don't import these directly in components!** Use the service layer instead:

```javascript
// ❌ Don't do this
import { mockEvents } from '@/data/mockEvents';

// ✅ Do this instead
import { getEvents } from '@/services/eventService';
```

## Why?

The service layer provides:
- Consistent API interface
- Simulated loading delays
- Easy transition to real APIs
- Better error handling
- Centralized data access

## Data Structure

### Events
Each event includes:
- Basic info (id, slug, name, description)
- Event details (type, sport, date, time, duration)
- Venue information
- Host details
- Participants list with status
- Teams (for team-based events)
- Cost breakdown
- Rules
- Check-in data

### Venues
Each venue includes:
- Basic info (id, slug, name, address, location)
- Capacity details
- Owner information
- Verification status
- Facilities with pricing
- Events hosted statistics
- Revenue data
- Reviews and ratings
- Amenities
- Contact information

## Updating Mock Data

When you need to add or modify mock data:

1. Edit the appropriate file (`mockEvents.js` or `mockVenues.js`)
2. Follow the existing data structure
3. Ensure all required fields are present
4. Test in the UI to verify changes

## Transition to Real API

When your backend is ready:
1. Keep these mock files (useful for testing)
2. Update the service layer in `src/services/`
3. Components will automatically use real data
4. No changes needed in component files!

# Backend Integration Guide

Your dashboard is **fully optimized and ready for backend integration**. The service layer architecture makes API integration seamless.

## 📁 Current Architecture

```
src/
├── services/                    # Service Layer (API abstraction)
│   ├── eventService.js         # Event operations
│   ├── venueService.js         # Venue operations
│   └── index.js                # Service exports
├── data/                        # Mock Data (temporary)
│   ├── mockEvents.js           # Event mock data
│   ├── mockVenues.js           # Venue mock data
│   └── lfg-dashboard-data.js   # Dashboard stats
└── components/                  # UI Components
    └── pages/                   # Page components (use services)
```

## 🔌 Current Status

### ✅ What's Ready
- **Service Layer**: Clean abstraction for events and venues
- **Mock Data**: Centralized in `src/data/` directory
- **Loading States**: All components handle async operations
- **Error Handling**: Try-catch blocks in place
- **Simulated Delays**: 300ms delays mimic real API behavior
- **Component Integration**: Pages already use service layer

### ⚠️ What Needs Backend
- Real API endpoints (REST or GraphQL)
- Authentication system
- Database connections
- API error handling
- Rate limiting
- Data validation

## 🚀 How to Integrate Backend

### Step 1: Set Up Environment Variables

Create `.env.local` in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
# or for production
# NEXT_PUBLIC_API_URL=https://api.yourapp.com

# Authentication (if using)
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain.com
```

### Step 2: Update Service Files

Your services are in `src/services/`. Simply replace the mock implementations:

#### Example: Event Service

**Current (Mock):**
```javascript
// src/services/eventService.js
import { mockEvents } from '@/data/mockEvents';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getEvents = async () => {
  await delay();
  return mockEvents;
};
```

**After (Real API):**
```javascript
// src/services/eventService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}` // if using auth
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  return response.json();
};
```

### Step 3: Components Already Ready!

Your components are **already using the service layer**, so they'll automatically use the real API once you update the services. No component changes needed!

```javascript
// src/components/pages/dashboard/events.jsx
import { getEvents } from '@/services/eventService';

// This code stays the same - it already uses the service!
useEffect(() => {
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents(); // Will use real API automatically
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };
  loadEvents();
}, []);
```

## 📋 Services to Implement

### Event Service (`src/services/eventService.js`)

Current functions ready for API integration:

```javascript
// Read Operations
getEvents()                    // GET /api/events
getEventBySlug(slug)          // GET /api/events/:slug
getEventById(id)              // GET /api/events/:id
filterEvents(filters)         // GET /api/events?filters

// Write Operations
createEvent(data)             // POST /api/events
updateEvent(id, updates)      // PUT/PATCH /api/events/:id
deleteEvent(id)               // DELETE /api/events/:id
```

### Venue Service (`src/services/venueService.js`)

Current functions ready for API integration:

```javascript
// Read Operations
getVenues()                   // GET /api/venues
getVenueBySlug(slug)         // GET /api/venues/:slug
getVenueById(id)             // GET /api/venues/:id
filterVenues(filters)        // GET /api/venues?filters

// Write Operations
createVenue(data)            // POST /api/venues
updateVenue(id, updates)     // PUT/PATCH /api/venues/:id
deleteVenue(id)              // DELETE /api/venues/:id
```

### Additional Services to Create

You may want to add these services:

```javascript
// src/services/authService.js
login(email, password)
logout()
register(userData)
getCurrentUser()
updateProfile(data)

// src/services/userService.js
getUsers(filters)
getUserById(id)
updateUser(id, data)
deleteUser(id)

// src/services/dashboardService.js
getStats()
getCharts()
getActivityFeed()
```

## 🔐 Authentication Implementation

### Step 1: Create Auth Service

```javascript
// src/services/authService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const { token, user } = await response.json();
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
```

### Step 2: Add Auth to Service Calls

Update your services to include auth headers:

```javascript
// src/services/eventService.js
import { getAuthToken } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEvents = async () => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/events`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};
```

### Step 3: Update Sign-In Page

```javascript
// src/app/auth/sign-in/page.jsx
import { login } from '@/services/authService';
import { useRouter } from 'next/navigation';

export function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard/home');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // ... rest of component
}
```

## 🎨 Error Handling

### Create a Centralized Error Handler

```javascript
// src/lib/apiError.js
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = async (response) => {
  const data = await response.json().catch(() => null);
  
  switch (response.status) {
    case 400:
      throw new ApiError('Bad Request', 400, data);
    case 401:
      throw new ApiError('Unauthorized', 401, data);
    case 403:
      throw new ApiError('Forbidden', 403, data);
    case 404:
      throw new ApiError('Not Found', 404, data);
    case 500:
      throw new ApiError('Server Error', 500, data);
    default:
      throw new ApiError('Request Failed', response.status, data);
  }
};
```

### Use in Services

```javascript
// src/services/eventService.js
import { handleApiError } from '@/lib/apiError';

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response.json();
};
```

### Handle in Components

```javascript
// Components already have try-catch blocks
try {
  const data = await getEvents();
  setEvents(data);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    router.push('/auth/sign-in');
  } else {
    // Show error message
    setError(error.message);
  }
}
```

## 📝 Data Models

Your mock data already defines the expected structure. Use these as your API contracts:

### Event Model
```javascript
{
  id: number,
  slug: string,
  name: string,
  description: string,
  eventType: 'Free For All' | 'Team vs Team' | 'Tournament' | 'Training',
  sport: string,
  date: string (YYYY-MM-DD),
  startTime: string (HH:MM),
  endTime: string (HH:MM),
  duration: number (hours),
  venue: {
    id: number,
    name: string,
    address: string,
    facility: string,
    mapUrl: string
  },
  host: {
    id: number,
    username: string,
    fullName: string,
    avatar: string,
    email: string,
    phone: string
  },
  participants: {
    current: number,
    total: number,
    confirmed: number,
    pending: number,
    cancelled: number
  },
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  cost: {
    facilityPricePerHour: number,
    totalHours: number,
    totalCost: number,
    costPerParticipant: number
  },
  createdDate: string (ISO),
  participantsList: Array<Participant>,
  teams?: Array<Team>,
  rules: string[],
  checkIns: {
    total: number,
    list: Array<CheckIn>
  }
}
```

### Venue Model
```javascript
{
  id: number,
  slug: string,
  name: string,
  address: string,
  region: string,
  city: string,
  province: string,
  capacity: number,
  playerCapacity: number,
  spectatorCapacity: number,
  status: 'Active' | 'Disabled',
  img: string (URL),
  images: string[],
  bookingStatus: 'Available' | 'Booked',
  sportType: string,
  surface: string,
  indoor: boolean,
  covered: boolean,
  owner: {
    id: number,
    username: string,
    fullName: string,
    email: string,
    phone: string
  },
  verification: {
    status: 'verified' | 'pending' | 'expired' | 'rejected',
    verifiedDate?: string,
    expiryDate?: string,
    verifiedBy?: string,
    documents: string[]
  },
  facilities: Array<Facility>,
  eventsHosted: {
    total: number,
    upcoming: number,
    past: number,
    thisMonth: number
  },
  revenue: {
    total: number,
    thisMonth: number,
    lastMonth: number
  },
  reviews: {
    averageRating: number,
    totalReviews: number,
    ratings: { 1: number, 2: number, 3: number, 4: number, 5: number }
  },
  amenities: string[],
  contact: {
    name: string,
    phone: string,
    email: string
  },
  openHours: string,
  mapUrl: string,
  coordinates: { lat: number, lng: number },
  createdDate: string (ISO)
}
```

### User Model (for future)
```javascript
{
  id: number,
  username: string,
  fullName: string,
  email: string,
  role: 'Organizer' | 'Player' | 'Coach' | 'Admin',
  status: 'Active' | 'Inactive' | 'Banned',
  mainSport: string,
  registrationDate: string (ISO),
  avatar: string (URL),
  eventsCreated: number,
  eventsJoined: number,
  rating: number,
  phone?: string
}
```

## 🔄 API Client Helper (Optional)

For cleaner code, create a reusable API client:

```javascript
// src/lib/apiClient.js
import { getAuthToken } from '@/services/authService';
import { handleApiError } from '@/lib/apiError';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  async request(endpoint, options = {}) {
    const token = getAuthToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient();
```

### Use in Services

```javascript
// src/services/eventService.js
import { apiClient } from '@/lib/apiClient';

export const getEvents = () => apiClient.get('/events');
export const getEventBySlug = (slug) => apiClient.get(`/events/${slug}`);
export const createEvent = (data) => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.patch(`/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);
```

## 🧪 Testing Strategy

### 1. Keep Mock Data for Development

```javascript
// src/services/eventService.js
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const getEvents = async () => {
  if (USE_MOCK) {
    await delay(300);
    return mockEvents;
  }
  return apiClient.get('/events');
};
```

### 2. Environment Variables

```bash
# .env.local (development with mocks)
NEXT_PUBLIC_USE_MOCK=true

# .env.production (real API)
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

## 🎯 Implementation Checklist

### Phase 1: Setup
- [ ] Create `.env.local` with API URL
- [ ] Create `src/lib/apiClient.js`
- [ ] Create `src/lib/apiError.js`
- [ ] Create `src/services/authService.js`

### Phase 2: Update Services
- [ ] Update `eventService.js` to use real API
- [ ] Update `venueService.js` to use real API
- [ ] Add error handling to all services
- [ ] Add authentication headers

### Phase 3: Authentication
- [ ] Implement login functionality
- [ ] Implement logout functionality
- [ ] Add protected route middleware
- [ ] Handle token expiration

### Phase 4: Testing
- [ ] Test all CRUD operations
- [ ] Test error scenarios
- [ ] Test authentication flow
- [ ] Test loading states

### Phase 5: Polish
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add retry logic
- [ ] Add request caching (optional)
- [ ] Add optimistic updates (optional)

## 📚 Complete Example: Events Page

### Before (Mock)
```javascript
// src/services/eventService.js
import { mockEvents } from '@/data/mockEvents';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getEvents = async () => {
  await delay();
  return mockEvents;
};
```

### After (Real API)
```javascript
// src/services/eventService.js
import { apiClient } from '@/lib/apiClient';

export const getEvents = () => apiClient.get('/events');
export const getEventBySlug = (slug) => apiClient.get(`/events/${slug}`);
export const createEvent = (data) => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.patch(`/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);
export const filterEvents = (filters) => apiClient.get('/events', filters);
```

**Component stays exactly the same!** ✨

## 🚀 Backend API Requirements

Your backend should implement these endpoints:

### Events API
```
GET    /api/events              # List all events
GET    /api/events/:slug        # Get single event
POST   /api/events              # Create event
PUT    /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event
```

### Venues API
```
GET    /api/venues              # List all venues
GET    /api/venues/:slug        # Get single venue
POST   /api/venues              # Create venue
PUT    /api/venues/:id          # Update venue
DELETE /api/venues/:id          # Delete venue
```

### Auth API
```
POST   /api/auth/login          # Login
POST   /api/auth/logout         # Logout
POST   /api/auth/register       # Register
GET    /api/auth/me             # Get current user
```

## 🎉 Summary

Your dashboard is **100% ready** for backend integration:

✅ **Service layer** - Clean abstraction  
✅ **Mock data** - Matches expected API structure  
✅ **Components** - Already use services  
✅ **Loading states** - Built-in  
✅ **Error handling** - Try-catch blocks ready  

**To integrate**: Just update the service files. Components work automatically! 🚀


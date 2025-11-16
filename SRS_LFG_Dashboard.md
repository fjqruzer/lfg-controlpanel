# Software Requirements Specification (SRS)
## LFG (Looking For Game) Sports Management Dashboard

**Version:** 1.0.0  
**Date:** November 2024  
**Project:** LFG Dashboard - Sports Venue & Event Management System

---

## 1. INTRODUCTION

### 1.1 Purpose
The LFG Dashboard is a comprehensive sports management system designed to facilitate the organization, management, and participation in sports events across various venues. The system serves as a centralized platform for venue owners, event organizers, players, and administrators to manage sports activities efficiently.

### 1.2 Scope
This system provides a web-based dashboard for managing:
- Sports venues and facilities
- Sports events and tournaments
- User management and profiles
- Event participation and team management
- Analytics and reporting
- Administrative functions

### 1.3 System Overview
The LFG Dashboard is built using Next.js 16 with React 19, featuring a modern, responsive design with custom Tailwind CSS components. The system uses localStorage for data persistence in the current implementation.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Technology Stack
- **Frontend Framework:** Next.js 16.0.0 (React 19.2.0)
- **Styling:** Tailwind CSS 3.4.18 with custom components
- **Icons:** Heroicons React 2.0.18
- **Charts:** ApexCharts 3.44.0 with React ApexCharts 1.4.1
- **State Management:** React Context API
- **Data Storage:** localStorage (current), designed for API integration
- **Build Tool:** Turbopack (Next.js 16)

### 2.2 Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # Reusable components
│   ├── cards/            # Card components
│   ├── charts/           # Chart components
│   ├── layout/           # Layout components
│   ├── pages/            # Page components
│   └── ui/               # UI components
├── configs/              # Configuration files
├── context/              # React Context providers
├── data/                 # Mock data and constants
└── lib/                  # Utility functions and API
```

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Authentication System

#### 3.1.1 Sign In Page (`/auth/sign-in`)
**CRUD Operations:** READ (user credentials validation)
- **Functionality:**
  - User login with email and password
  - Remember me functionality
  - Password validation
  - Redirect to dashboard on successful login
- **Components:** Input fields, checkbox, submit button
- **Validation:** Email format, password requirements

#### 3.1.2 Sign Up Page (`/auth/sign-up`)
**CRUD Operations:** CREATE (new user registration)
- **Functionality:**
  - New user registration
  - Email validation
  - Terms and conditions acceptance
  - Account creation
- **Components:** Input fields, checkbox, submit button
- **Validation:** Email uniqueness, password strength

### 3.2 Dashboard System

#### 3.2.1 Home Dashboard (`/dashboard/home`)
**CRUD Operations:** READ (analytics and statistics)
- **Functionality:**
  - Display key performance indicators (KPIs)
  - User registration trends
  - Event creation analytics
  - Popular sports statistics
  - Real-time data visualization
- **Components:**
  - Statistics cards (6 cards): Users, Events, Venues, Teams, Support Tickets, Flagged Content
  - Charts: User registration trend, Event creation by type, Popular sports
  - Analytics overview
- **Data Sources:**
  - Total registered users: 2,847 (+12% vs last month)
  - Active events: 156 (+24 this week)
  - Total venues: 43 (38 verified, 5 pending)
  - Total teams: 127 (+8 new this month)
  - Support tickets: 23 (12 urgent)
  - Flagged content: 9 (3 new)

### 3.3 Venue Management System

#### 3.3.1 Venues List Page (`/dashboard/venues`)
**CRUD Operations:** CREATE, READ, UPDATE, DELETE
- **Functionality:**
  - View all venues in grid or list format
  - Add new venues
  - Edit existing venues
  - Delete venues
  - Search and filter venues
  - View toggle (grid/list)
- **Components:**
  - View mode toggle (grid/list)
  - Venue cards (grid view)
  - Venue table (list view)
  - Add venue form with tabs (Overview/Add Venue)
- **Data Model:**
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
  status: "Active" | "Inactive",
  img: string,
  images: string[],
  bookingStatus: "Available" | "Booked",
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
    status: "verified" | "pending" | "expired" | "rejected",
    verifiedDate: string,
    expiryDate: string,
    verifiedBy: string,
    documents: string[]
  },
  facilities: [{
    id: number,
    name: string,
    type: string,
    pricePerHour: number,
    photos: string[],
    totalBookings: number,
    description: string
  }],
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
    ratings: { 5: number, 4: number, 3: number, 2: number, 1: number }
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
  createdDate: string
}
```

#### 3.3.2 Venue Detail Page (`/dashboard/venues/[slug]`)
**CRUD Operations:** READ, UPDATE
- **Functionality:**
  - View detailed venue information
  - Edit venue details
  - Manage facilities
  - View booking history
  - Manage venue images
  - View analytics and reviews
- **Components:**
  - Venue header with image gallery
  - Facility management
  - Booking calendar
  - Analytics dashboard
  - Review system

### 3.4 Event Management System

#### 3.4.1 Events List Page (`/dashboard/events`)
**CRUD Operations:** CREATE, READ, UPDATE, DELETE
- **Functionality:**
  - View all events in table or calendar format
  - Create new events
  - Edit existing events
  - Cancel events
  - Search and filter events
  - Export event data
  - Bulk operations
- **Components:**
  - Enhanced header with search and filters
  - View mode toggle (table/calendar)
  - Events table with sorting
  - Calendar view (month/week/day)
  - Add event dialog
  - Filter system (event type, sport, status, venue, date)
- **Data Model:**
```javascript
{
  id: number,
  slug: string,
  name: string,
  description: string,
  eventType: "Free For All" | "Team vs Team" | "Tournament" | "Training" | "Scrimmage" | "League" | "Friendly",
  sport: string,
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
  venue: {
    id: number,
    name: string,
    address: string,
    facility: string
  },
  host: {
    id: number,
    username: string,
    fullName: string,
    avatar: string
  },
  participants: {
    current: number,
    total: number,
    confirmed: number,
    pending: number,
    cancelled: number
  },
  status: "upcoming" | "ongoing" | "completed" | "cancelled",
  cost: {
    facilityPricePerHour: number,
    totalHours: number,
    totalCost: number,
    costPerParticipant: number
  },
  createdDate: string,
  participantsList: [{
    id: number,
    username: string,
    fullName: string,
    status: "confirmed" | "pending" | "cancelled",
    avatar: string
  }],
  teams?: [{
    id: number,
    name: string,
    members: Array
  }]
}
```

#### 3.4.2 Event Detail Page (`/dashboard/events/[slug]`)
**CRUD Operations:** READ, UPDATE
- **Functionality:**
  - View comprehensive event details
  - Manage participants
  - Handle check-ins
  - View event rules
  - Manage teams (for tournaments)
  - Event analytics
- **Components:**
  - Event hero section with key information
  - Statistics cards (participants, cost, duration, check-ins)
  - Tabbed interface (Details, Participants, Check-ins)
  - Participant management table
  - Check-in system
  - Cost breakdown
- **Features:**
  - Monochrome design theme
  - Philippine peso (₱) currency display
  - Real-time participant tracking
  - Team management for tournaments
  - Check-in tracking system

### 3.5 User Management System

#### 3.5.1 Users List Page (`/dashboard/users`)
**CRUD Operations:** CREATE, READ, UPDATE, DELETE
- **Functionality:**
  - View all users in table format
  - Add new users
  - Edit user profiles
  - Ban/unban users
  - Search and filter users
  - Export user data
  - Bulk operations
- **Components:**
  - Enhanced header with search and filters
  - Users table with sorting
  - Filter system (role, sport, status)
  - Bulk action tools
  - Ban/unban dialogs
- **Data Model:**
```javascript
{
  id: number,
  username: string,
  fullName: string,
  email: string,
  role: "Organizer" | "Player" | "Coach",
  status: "Active" | "Inactive" | "Banned",
  mainSport: string,
  registrationDate: string,
  avatar: string,
  eventsCreated: number,
  eventsJoined: number,
  rating: number
}
```

#### 3.5.2 User Profile Page (`/dashboard/profile`)
**CRUD Operations:** READ, UPDATE
- **Functionality:**
  - View user profile information
  - Edit profile settings
  - Manage platform settings
  - View conversations
  - Update preferences
- **Components:**
  - Profile header with avatar
  - Tabbed interface (App, Message, Settings)
  - Platform settings toggles
  - Message system
  - Profile information cards

### 3.6 UI Component System

#### 3.6.1 Custom UI Components
The system includes a comprehensive set of custom UI components:
- **Form Components:** Button, Input, Textarea, Select, Checkbox, Switch
- **Display Components:** Card, Typography, Avatar, Chip, StatusChip
- **Navigation Components:** Tabs, Menu, Dialog
- **Data Components:** Progress, Chart components
- **Layout Components:** Sidenav, Navbar, Footer

#### 3.6.2 Design System
- **Color Scheme:** Monochrome design with gray scale palette
- **Typography:** Consistent typography hierarchy
- **Spacing:** Standardized spacing system
- **Components:** Reusable component library
- **Icons:** Heroicons integration
- **Responsive:** Mobile-first responsive design

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance Requirements
- Page load time: < 2 seconds
- Component rendering: < 100ms
- Search/filter operations: < 500ms
- Chart rendering: < 1 second

### 4.2 Usability Requirements
- Responsive design for desktop, tablet, and mobile
- Intuitive navigation and user interface
- Consistent design patterns
- Accessibility compliance (WCAG 2.1)

### 4.3 Security Requirements
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure authentication
- Data encryption

### 4.4 Scalability Requirements
- Modular component architecture
- Efficient state management
- Optimized rendering
- Code splitting and lazy loading

---

## 5. DATA MANAGEMENT

### 5.1 Current Implementation
- **Storage:** localStorage for client-side persistence
- **Data Format:** JSON objects
- **State Management:** React Context API
- **Data Validation:** Client-side validation

### 5.2 Future API Integration
The system is designed for easy integration with REST APIs:
- RESTful endpoint structure
- JSON data exchange
- Error handling
- Loading states
- Caching strategies

---

## 6. SYSTEM FEATURES SUMMARY

### 6.1 Core CRUD Operations by Module

| Module | Create | Read | Update | Delete | Additional Features |
|--------|--------|------|--------|--------|-------------------|
| **Authentication** | ✓ (Sign Up) | ✓ (Sign In) | - | - | Session management |
| **Dashboard** | - | ✓ (Analytics) | - | - | Real-time charts, KPIs |
| **Venues** | ✓ (Add Venue) | ✓ (List/Detail) | ✓ (Edit) | ✓ (Remove) | Search, Filter, Grid/List view |
| **Events** | ✓ (New Event) | ✓ (List/Detail) | ✓ (Edit) | ✓ (Cancel) | Calendar view, Bulk ops, Export |
| **Users** | ✓ (Add User) | ✓ (List/Profile) | ✓ (Edit) | ✓ (Ban) | Search, Filter, Bulk actions |

### 6.2 Key Features
- **Multi-view Support:** Grid, List, Table, Calendar views
- **Advanced Filtering:** Multi-criteria filtering system
- **Bulk Operations:** Mass actions on selected items
- **Export Functionality:** CSV export capabilities
- **Real-time Updates:** Live data synchronization
- **Responsive Design:** Mobile-optimized interface
- **Monochrome Theme:** Professional, consistent design
- **Philippine Localization:** Peso currency support

---

## 7. CONCLUSION

The LFG Dashboard provides a comprehensive solution for sports venue and event management with a modern, scalable architecture. The system supports full CRUD operations across all major entities (venues, events, users) with advanced features like analytics, filtering, and multi-view displays. The modular design and custom component library ensure maintainability and extensibility for future enhancements.

The current implementation uses localStorage for data persistence but is architected for seamless integration with backend APIs, making it production-ready for deployment with minimal modifications.
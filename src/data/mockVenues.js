// Mock Venues Data
// This file contains all mock venue data for frontend development
// Replace with real API calls when backend is ready

export const mockVenues = [
  {
    id: 1,
    slug: "gg-arena",
    name: "GG Arena",
    address: "123 Game St, Makati, NCR",
    region: "NCR",
    city: "Makati",
    province: "Metro Manila",
    capacity: 120,
    playerCapacity: 120,
    spectatorCapacity: 200,
    status: "Active",
    img: "/img/home-decor-1.jpeg",
    images: ["/img/home-decor-1.jpeg", "/img/home-decor-2.jpeg"],
    bookingStatus: "Available",
    sportType: "Basketball",
    surface: "Hardwood",
    indoor: true,
    owner: {
      id: 1,
      username: "arena_owner",
      fullName: "John Arena",
      email: "john@ggarena.com",
      phone: "+63 917 123 4567"
    },
    verification: {
      status: "verified", // verified, pending, expired, rejected
      verifiedDate: "2024-01-15",
      expiryDate: "2025-01-15",
      verifiedBy: "admin_user",
      documents: ["business_permit.pdf", "safety_certificate.pdf"]
    },
    facilities: [
      {
        id: 1,
        name: "Main Basketball Court",
        type: "Basketball Court",
        pricePerHour: 1500,
        photos: ["/img/home-decor-1.jpeg"],
        totalBookings: 45,
        description: "Full-size basketball court with professional lighting"
      },
      {
        id: 2,
        name: "Training Court",
        type: "Basketball Court",
        pricePerHour: 800,
        photos: ["/img/home-decor-2.jpeg"],
        totalBookings: 23,
        description: "Half-court for training and practice"
      }
    ],
    eventsHosted: {
      total: 67,
      upcoming: 12,
      past: 55,
      thisMonth: 8
    },
    revenue: {
      total: 245000,
      thisMonth: 45000,
      lastMonth: 38000
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 34,
      ratings: {
        5: 24,
        4: 8,
        3: 2,
        2: 0,
        1: 0
      }
    },
    createdDate: "2023-12-01",
    amenities: ["Parking", "Restrooms", "Locker Rooms", "Lighting", "Scoreboard"],
    contact: {
      name: "John Arena",
      phone: "+63 917 123 4567",
      email: "john@ggarena.com"
    },
    openHours: "6:00 AM - 10:00 PM",
    mapUrl: "https://maps.google.com/?q=14.5547,121.0244",
    coordinates: { lat: 14.5547, lng: 121.0244 }
  },
  {
    id: 2,
    slug: "quest-hub",
    name: "Quest Hub",
    address: "45 Raid Ave, Cebu City, Region VII",
    region: "Region VII",
    city: "Cebu City",
    province: "Cebu",
    capacity: 80,
    playerCapacity: 80,
    spectatorCapacity: 150,
    status: "Active",
    img: "/img/home-decor-2.jpeg",
    images: ["/img/home-decor-2.jpeg", "/img/home-decor-1.jpeg"],
    bookingStatus: "Booked",
    sportType: "Volleyball",
    surface: "Synthetic",
    indoor: false,
    covered: true,
    owner: {
      id: 2,
      username: "quest_admin",
      fullName: "Maria Quest",
      email: "maria@questhub.com",
      phone: "+63 932 987 6543"
    },
    verification: {
      status: "pending",
      submittedDate: "2024-10-15",
      documents: ["business_permit.pdf"]
    },
    facilities: [
      {
        id: 3,
        name: "Main Volleyball Court",
        type: "Volleyball Court",
        pricePerHour: 1200,
        photos: ["/img/home-decor-2.jpeg"],
        totalBookings: 32,
        description: "Professional volleyball court with sand surface"
      }
    ],
    eventsHosted: {
      total: 23,
      upcoming: 5,
      past: 18,
      thisMonth: 3
    },
    revenue: {
      total: 89000,
      thisMonth: 15000,
      lastMonth: 22000
    },
    reviews: {
      averageRating: 4.2,
      totalReviews: 18,
      ratings: {
        5: 8,
        4: 7,
        3: 3,
        2: 0,
        1: 0
      }
    },
    createdDate: "2024-02-10",
    amenities: ["Parking", "Restrooms", "Water Station", "Seating"],
    contact: {
      name: "Maria Quest",
      phone: "+63 932 987 6543",
      email: "maria@questhub.com"
    },
    openHours: "7:00 AM - 9:00 PM",
    mapUrl: "https://maps.google.com/?q=10.3157,123.8854",
    coordinates: { lat: 10.3157, lng: 123.8854 }
  },
  {
    id: 3,
    slug: "sbfz-sports-complex",
    name: "SBFZ Sports Complex",
    address: "Aguinaldo Street, Subic Bay Freeport Zone, Olongapo City, Zambales 2200, Philippines",
    region: "Central Luzon",
    city: "Olongapo City",
    province: "Zambales",
    capacity: 3000,
    playerCapacity: 150,
    spectatorCapacity: 1500,
    status: "Active",
    img: "/img/sbfz-main.jpeg",
    images: ["/img/sbfz-main.jpeg", "/img/sbfz-court.jpeg", "/img/sbfz-facilities.jpeg"],
    bookingStatus: "Available",
    sportType: "Multi-sport",
    surface: "Hardwood / Synthetic Multi-use",
    indoor: true,
    covered: true,
    owner: {
      id: 3,
      username: "sbma_manager",
      fullName: "Subic Bay Metropolitan Authority",
      email: "info@sbma.gov.ph",
      phone: "+63 47 252 0123"
    },
    verification: {
      status: "verified",
      verifiedDate: "2024-02-01",
      expiryDate: "2025-02-01",
      verifiedBy: "sbma_admin",
      documents: ["business_permit_sbma.pdf", "safety_certificate_sbma.pdf", "insurance_policy_sbma.pdf"]
    },
    facilities: [
      {
        id: 4,
        name: "Main Indoor Arena Court",
        type: "Basketball/Volleyball Court",
        pricePerHour: 2500,
        photos: ["/img/sbfz-maincourt.jpeg"],
        totalBookings: 60,
        description: "Full-size indoor hardwood court with lighting, scoreboard & PA system."
      },
      {
        id: 5,
        name: "Practice Hall",
        type: "Multipurpose Training Hall",
        pricePerHour: 1200,
        photos: ["/img/sbfz-practicehall.jpeg"],
        totalBookings: 30,
        description: "Smaller indoor hall suitable for trainings, drills, etc."
      },
      {
        id: 6,
        name: "Outdoor Track & Field Segment",
        type: "Track Field",
        pricePerHour: 1800,
        photos: ["/img/sbfz-track.jpeg"],
        totalBookings: 25,
        description: "6-lane 400m track and adjacent field area for field events."
      }
    ],
    eventsHosted: {
      total: 120,
      upcoming: 5,
      past: 115,
      thisMonth: 3
    },
    revenue: {
      total: 750000,
      thisMonth: 85000,
      lastMonth: 78000
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 78,
      ratings: {
        5: 50,
        4: 20,
        3: 6,
        2: 2,
        1: 0
      }
    },
    createdDate: "2022-06-15",
    amenities: ["Parking", "Restrooms", "Locker Rooms", "Lighting", "Scoreboard", "Air Conditioning", "Water Station", "First Aid Kit", "Snack Bar"],
    contact: {
      name: "Venue Manager – SBMA",
      phone: "+63 47 252 0123",
      email: "venue.sbma@sbma.gov.ph"
    },
    openHours: "5:00 AM - 11:00 PM",
    mapUrl: "https://maps.google.com/?q=14.82282,120.28297",
    coordinates: { lat: 14.82282, lng: 120.28297 }
  },
];

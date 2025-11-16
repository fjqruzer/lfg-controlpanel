// Mock Events Data
// This file contains all mock event data for frontend development
// Replace with real API calls when backend is ready

export const mockEvents = [
  {
    id: 1,
    slug: "basketball-5v5-pickup-gg-arena",
    name: "Basketball 5v5 Pickup",
    description: "Casual basketball game for intermediate players. Come join us for a fun evening of basketball! We welcome players of all skill levels, but intermediate experience is preferred. Bring your own water and towel.",
    eventType: "Free For All",
    sport: "Basketball",
    date: "2024-11-15",
    startTime: "18:00",
    endTime: "20:00",
    duration: 2,
    venue: {
      id: 1,
      name: "GG Arena",
      address: "123 Game St, Makati, NCR",
      facility: "Main Basketball Court",
      mapUrl: "https://maps.google.com/?q=14.5547,121.0244"
    },
    host: {
      id: 1,
      username: "marco_santos",
      fullName: "Marco Santos",
      avatar: "https://i.pravatar.cc/80?img=1",
      email: "marco@example.com",
      phone: "+63 917 123 4567"
    },
    participants: {
      current: 8,
      total: 10,
      confirmed: 6,
      pending: 2,
      cancelled: 0
    },
    status: "upcoming", // upcoming, ongoing, completed, cancelled
    cost: {
      facilityPricePerHour: 1500,
      totalHours: 2,
      totalCost: 3000,
      costPerParticipant: 300
    },
    createdDate: "2024-11-01",
    participantsList: [
      { id: 1, username: "marco_santos", fullName: "Marco Santos", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=1", joinedDate: "2024-11-01" },
      { id: 2, username: "bea_lim", fullName: "Bea Lim", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=2", joinedDate: "2024-11-02" },
      { id: 3, username: "ken_reyes", fullName: "Ken Reyes", status: "pending", avatar: "https://i.pravatar.cc/80?img=3", joinedDate: "2024-11-03" },
      { id: 4, username: "toni_cruz", fullName: "Toni Cruz", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=4", joinedDate: "2024-11-02" },
      { id: 5, username: "ana_garcia", fullName: "Ana Garcia", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=5", joinedDate: "2024-11-04" },
      { id: 6, username: "carlos_lopez", fullName: "Carlos Lopez", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=6", joinedDate: "2024-11-03" },
      { id: 7, username: "sara_martinez", fullName: "Sara Martinez", status: "pending", avatar: "https://i.pravatar.cc/80?img=7", joinedDate: "2024-11-05" },
      { id: 8, username: "john_doe", fullName: "John Doe", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=8", joinedDate: "2024-11-04" },
    ],
    rules: [
      "Arrive 15 minutes before start time",
      "Bring your own water bottle",
      "No aggressive play - keep it friendly",
      "Respect the facility and other players",
      "Payment due before the game starts"
    ],
    checkIns: {
      total: 6,
      list: [
        { id: 1, username: "marco_santos", fullName: "Marco Santos", checkedInAt: "2024-11-15T17:45:00Z" },
        { id: 2, username: "bea_lim", fullName: "Bea Lim", checkedInAt: "2024-11-15T17:50:00Z" },
        { id: 4, username: "toni_cruz", fullName: "Toni Cruz", checkedInAt: "2024-11-15T17:48:00Z" },
        { id: 5, username: "ana_garcia", fullName: "Ana Garcia", checkedInAt: "2024-11-15T17:52:00Z" },
        { id: 6, username: "carlos_lopez", fullName: "Carlos Lopez", checkedInAt: "2024-11-15T17:47:00Z" },
        { id: 8, username: "john_doe", fullName: "John Doe", checkedInAt: "2024-11-15T17:55:00Z" },
      ]
    }
  },
  {
    id: 2,
    slug: "volleyball-tournament-quest-hub",
    name: "Volleyball Tournament Finals",
    description: "Championship match between top teams",
    eventType: "Team vs Team",
    sport: "Volleyball",
    date: "2024-11-20",
    startTime: "14:00",
    endTime: "17:00",
    duration: 3,
    venue: {
      id: 2,
      name: "Quest Hub",
      address: "45 Raid Ave, Cebu City, Region VII",
      facility: "Main Volleyball Court",
      mapUrl: "https://maps.google.com/?q=10.3157,123.8854"
    },
    host: {
      id: 2,
      username: "quest_admin",
      fullName: "Maria Quest",
      avatar: "https://i.pravatar.cc/80?img=9",
      email: "maria@questhub.com",
      phone: "+63 932 987 6543"
    },
    participants: {
      current: 12,
      total: 12,
      confirmed: 12,
      pending: 0,
      cancelled: 0
    },
    teams: [
      {
        id: 1,
        name: "Spike Masters",
        members: [
          { id: 9, username: "player1", fullName: "Player One", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=9", joinedDate: "2024-10-15" },
          { id: 10, username: "player2", fullName: "Player Two", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=10", joinedDate: "2024-10-15" },
          { id: 11, username: "player3", fullName: "Player Three", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=11", joinedDate: "2024-10-15" },
          { id: 12, username: "player4", fullName: "Player Four", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=12", joinedDate: "2024-10-15" },
          { id: 13, username: "player5", fullName: "Player Five", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=13", joinedDate: "2024-10-15" },
          { id: 14, username: "player6", fullName: "Player Six", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=14", joinedDate: "2024-10-15" },
        ]
      },
      {
        id: 2,
        name: "Net Crushers",
        members: [
          { id: 15, username: "crusher1", fullName: "Crusher One", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=15", joinedDate: "2024-10-16" },
          { id: 16, username: "crusher2", fullName: "Crusher Two", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=16", joinedDate: "2024-10-16" },
          { id: 17, username: "crusher3", fullName: "Crusher Three", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=17", joinedDate: "2024-10-16" },
          { id: 18, username: "crusher4", fullName: "Crusher Four", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=18", joinedDate: "2024-10-16" },
          { id: 19, username: "crusher5", fullName: "Crusher Five", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=19", joinedDate: "2024-10-16" },
          { id: 20, username: "crusher6", fullName: "Crusher Six", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=20", joinedDate: "2024-10-16" },
        ]
      }
    ],
    status: "upcoming",
    cost: {
      facilityPricePerHour: 1200,
      totalHours: 3,
      totalCost: 3600,
      costPerParticipant: 300
    },
    createdDate: "2024-10-25",
    participantsList: [],
    rules: [
      "Teams must arrive 30 minutes before match time",
      "Official volleyball rules apply",
      "Bring team jerseys",
      "Respect referees' decisions"
    ],
    checkIns: {
      total: 12,
      list: []
    }
  },
  {
    id: 3,
    slug: "football-training-session",
    name: "Football Training Session",
    description: "Weekly training for beginners",
    eventType: "Training",
    sport: "Football",
    date: "2024-11-10",
    startTime: "16:00",
    endTime: "18:00",
    duration: 2,
    venue: {
      id: 3,
      name: "Sports Central",
      address: "789 Field Ave, Quezon City, NCR",
      facility: "Football Field A",
      mapUrl: "https://maps.google.com/?q=14.6760,121.0437"
    },
    host: {
      id: 3,
      username: "coach_mike",
      fullName: "Coach Mike Johnson",
      avatar: "https://i.pravatar.cc/80?img=21",
      email: "coach.mike@example.com",
      phone: "+63 917 555 1234"
    },
    participants: {
      current: 15,
      total: 20,
      confirmed: 13,
      pending: 2,
      cancelled: 0
    },
    status: "completed",
    cost: {
      facilityPricePerHour: 2000,
      totalHours: 2,
      totalCost: 4000,
      costPerParticipant: 267
    },
    createdDate: "2024-10-20",
    participantsList: [],
    rules: [
      "Bring proper football boots",
      "Arrive on time for warm-up",
      "Follow coach instructions"
    ],
    checkIns: {
      total: 15,
      list: []
    }
  },
  {
    id: 4,
    slug: "basketball-tournament-sbfz-championship",
    name: "SBFZ Basketball Championship",
    description: "Annual basketball tournament at SBFZ Sports Complex featuring teams from Central Luzon. This premier tournament brings together the best basketball teams from the region for an exciting day of competition. Professional referees, live scoring, and prizes for winners!",
    eventType: "Tournament",
    sport: "Basketball",
    date: "2024-11-25",
    startTime: "08:00",
    endTime: "18:00",
    duration: 10,
    venue: {
      id: 3,
      name: "SBFZ Sports Complex",
      address: "Aguinaldo Street, Subic Bay Freeport Zone, Olongapo City, Zambales",
      facility: "Main Indoor Arena Court",
      mapUrl: "https://maps.google.com/?q=14.82282,120.28297"
    },
    host: {
      id: 4,
      username: "sbma_events",
      fullName: "SBMA Events Team",
      avatar: "https://i.pravatar.cc/80?img=25",
      email: "events@sbma.gov.ph",
      phone: "+63 47 252 0123"
    },
    participants: {
      current: 48,
      total: 48,
      confirmed: 44,
      pending: 4,
      cancelled: 0
    },
    status: "upcoming",
    cost: {
      facilityPricePerHour: 2500,
      totalHours: 10,
      totalCost: 25000,
      costPerParticipant: 521
    },
    createdDate: "2024-10-01",
    teams: [
      {
        id: 3,
        name: "Zambales Warriors",
        members: [
          { id: 21, username: "warrior1", fullName: "Mark Trinidad", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=21", joinedDate: "2024-10-05" },
          { id: 22, username: "warrior2", fullName: "John Santos", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=22", joinedDate: "2024-10-05" },
          { id: 23, username: "warrior3", fullName: "Mike Garcia", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=23", joinedDate: "2024-10-05" },
          { id: 24, username: "warrior4", fullName: "Dave Cruz", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=24", joinedDate: "2024-10-05" },
          { id: 25, username: "warrior5", fullName: "Alex Reyes", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=25", joinedDate: "2024-10-05" },
          { id: 26, username: "warrior6", fullName: "Ben Lopez", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=26", joinedDate: "2024-10-05" }
        ]
      },
      {
        id: 4,
        name: "Subic Bay Ballers",
        members: [
          { id: 27, username: "baller1", fullName: "Carlos Mendoza", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=27", joinedDate: "2024-10-08" },
          { id: 28, username: "baller2", fullName: "Rico Dela Cruz", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=28", joinedDate: "2024-10-08" },
          { id: 29, username: "baller3", fullName: "Tony Villanueva", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=29", joinedDate: "2024-10-08" },
          { id: 30, username: "baller4", fullName: "Jun Morales", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=30", joinedDate: "2024-10-08" },
          { id: 31, username: "baller5", fullName: "Ryan Aquino", status: "pending", avatar: "https://i.pravatar.cc/80?img=31", joinedDate: "2024-10-12" },
          { id: 32, username: "baller6", fullName: "Luis Fernandez", status: "pending", avatar: "https://i.pravatar.cc/80?img=32", joinedDate: "2024-10-12" }
        ]
      }
    ],
    participantsList: [
      { id: 21, username: "warrior1", fullName: "Mark Trinidad", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=21", joinedDate: "2024-10-05", team: "Zambales Warriors" },
      { id: 22, username: "warrior2", fullName: "John Santos", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=22", joinedDate: "2024-10-05", team: "Zambales Warriors" },
      { id: 23, username: "warrior3", fullName: "Mike Garcia", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=23", joinedDate: "2024-10-05", team: "Zambales Warriors" },
      { id: 27, username: "baller1", fullName: "Carlos Mendoza", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=27", joinedDate: "2024-10-08", team: "Subic Bay Ballers" },
      { id: 28, username: "baller2", fullName: "Rico Dela Cruz", status: "confirmed", avatar: "https://i.pravatar.cc/80?img=28", joinedDate: "2024-10-08", team: "Subic Bay Ballers" },
      { id: 31, username: "baller5", fullName: "Ryan Aquino", status: "pending", avatar: "https://i.pravatar.cc/80?img=31", joinedDate: "2024-10-12", team: "Subic Bay Ballers" }
    ],
    rules: [
      "Tournament format: Single elimination",
      "Game duration: 4 quarters of 10 minutes each",
      "Teams must arrive 30 minutes before scheduled game time",
      "Official FIBA basketball rules apply",
      "Professional referees will officiate all games",
      "No outside food or drinks allowed in the arena",
      "Team captains must attend pre-tournament briefing"
    ],
    checkIns: {
      total: 20,
      list: [
        { id: 21, username: "warrior1", fullName: "Mark Trinidad", checkedInAt: "2024-11-25T07:30:00Z", team: "Zambales Warriors" },
        { id: 22, username: "warrior2", fullName: "John Santos", checkedInAt: "2024-11-25T07:32:00Z", team: "Zambales Warriors" },
        { id: 27, username: "baller1", fullName: "Carlos Mendoza", checkedInAt: "2024-11-25T07:35:00Z", team: "Subic Bay Ballers" },
        { id: 28, username: "baller2", fullName: "Rico Dela Cruz", checkedInAt: "2024-11-25T07:38:00Z", team: "Subic Bay Ballers" }
      ]
    }
  }
];

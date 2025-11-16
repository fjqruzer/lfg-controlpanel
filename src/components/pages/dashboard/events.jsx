"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  IconButton,
  Input,
  Chip,
  Checkbox,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  StatusChip,
  Tabs,
  TabsHeader,
  Tab,
} from "@/components/ui";
import { 
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TableCellsIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { getEvents } from "@/services/eventService";

const eventTypes = ["All", "Free For All", "Team vs Team", "Tournament", "Training", "Scrimmage", "League", "Friendly"];
const sports = ["All", "Basketball", "Volleyball", "Football", "Tennis", "Badminton", "Swimming"];
const statuses = ["All", "upcoming", "ongoing", "completed", "cancelled"];
const venues = ["All", "GG Arena", "Quest Hub", "Sports Central", "SBFZ Sports Complex"];

export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [venueFilter, setVenueFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table, calendar
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month"); // month, week, day

  // Load events from service
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Filter and sort events
  const filtered = events
    .filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(query.toLowerCase()) || 
                           event.host.fullName.toLowerCase().includes(query.toLowerCase()) ||
                           event.venue.name.toLowerCase().includes(query.toLowerCase());
      const matchesEventType = eventTypeFilter === "All" || event.eventType === eventTypeFilter;
      const matchesSport = sportFilter === "All" || event.sport === sportFilter;
      const matchesStatus = statusFilter === "All" || event.status === statusFilter;
      const matchesVenue = venueFilter === "All" || event.venue.name === venueFilter;
      const matchesDate = !dateFilter || event.date === dateFilter;
      
      return matchesSearch && matchesEventType && matchesSport && matchesStatus && matchesVenue && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === "name" || sortBy === "host") {
        const aVal = sortBy === "name" ? a.name : a.host.fullName;
        const bVal = sortBy === "name" ? b.name : b.host.fullName;
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (sortBy === "date") {
        const aDate = new Date(`${a.date} ${a.startTime}`);
        const bDate = new Date(`${b.date} ${b.startTime}`);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === "participants") {
        return sortOrder === "asc" ? a.participants.current - b.participants.current : b.participants.current - a.participants.current;
      }
      return 0;
    });

  const handleSelectAll = () => {
    if (selectedEvents.length === filtered.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filtered.map(e => e.id));
    }
  };

  const handleSelectEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleCancelEvent = (event) => {
    setEventToCancel(event);
    setShowCancelDialog(true);
  };

  const handleExport = (format) => {
    const dataToExport = selectedEvents.length > 0 
      ? events.filter(e => selectedEvents.includes(e.id))
      : filtered;
    
    if (format === "csv") {
      const headers = ["Event Name", "Type", "Sport", "Date", "Time", "Venue", "Host", "Participants", "Status"];
      const rows = dataToExport.map(e => [
        e.name,
        e.eventType,
        e.sport,
        e.date,
        `${e.startTime} - ${e.endTime}`,
        e.venue.name,
        e.host.fullName,
        `${e.participants.current}/${e.participants.total}`,
        e.status
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(",")).join("\\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `events_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "blue";      // Blue for future events
      case "ongoing": return "green";      // Green for active events
      case "completed": return "blue-gray"; // Blue-gray for finished events
      case "cancelled": return "red";      // Red for cancelled events
      default: return "blue-gray";
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "Free For All": return "blue";
      case "Team vs Team": return "purple";
      case "Tournament": return "amber";
      case "Training": return "green";
      case "Scrimmage": return "cyan";
      case "League": return "red";
      case "Friendly": return "pink";
      default: return "gray";
    }
  };

  // Calendar helper functions
  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filtered.filter(event => event.date === dateStr);
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(calendarDate);
    if (calendarView === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (calendarView === "week") {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (calendarView === "day") {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCalendarDate(newDate);
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  const getSportColor = (sport) => {
    switch (sport) {
      case "Basketball": return "bg-blue-100 text-blue-700";
      case "Volleyball": return "bg-purple-100 text-purple-700";
      case "Football": return "bg-green-100 text-green-700";
      case "Tennis": return "bg-amber-100 text-amber-700";
      case "Badminton": return "bg-pink-100 text-pink-700";
      case "Swimming": return "bg-cyan-100 text-cyan-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-0 relative">
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <CalendarDaysIcon className="h-6 w-6" />
              </div>
              <Typography variant="h5" color="white" className="font-bold">
                Event Management
              </Typography>
            </div>
            <Typography variant="small" className="text-white/90 mb-4">
              Manage sports events, tournaments, and training sessions
            </Typography>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Typography variant="small" className="text-white/70">Total Events</Typography>
                <Typography variant="h6" color="white">{events.length}</Typography>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Typography variant="small" className="text-white/70">This Week</Typography>
                <Typography variant="h6" color="white">{events.filter(e => e.status === 'upcoming').length}</Typography>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Typography variant="small" className="text-white/70">Active Now</Typography>
                <Typography variant="h6" color="white">{events.filter(e => e.status === 'ongoing').length}</Typography>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Typography variant="small" className="text-white/70">Completed</Typography>
                <Typography variant="h6" color="white">{events.filter(e => e.status === 'completed').length}</Typography>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 lg:w-80">
            {/* Enhanced Search */}
            <div className="relative">
              <Input 
                label="Search events, hosts, venues..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                className="!border-white/20 focus:!border-white/40 !bg-white/5"
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-white/50" />}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outlined" 
                color="white"
                className="flex-1 border-white/20 text-white hover:bg-white/5 flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-4 w-4 mr-2 text-white -mt-0.5" />
                Filters
              </Button>
              <Button 
                variant="filled" 
                color="gray"
                className="flex-1 transition-colors flex items-center justify-center"
                style={{
                  backgroundColor: "white",
                  color: "#1f2937",
                  border: "1px solid #e5e7eb"
                }}
                onClick={() => setShowAddEventDialog(true)}
              >
                <PlusIcon className="h-4 w-4 mr-2 -mt-0.5" style={{ color: "#1f2937" }} />
                New Event
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select 
              label="Event Type"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e)}
            >
              {eventTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
            
            <Select 
              label="Sport"
              value={sportFilter}
              onChange={(e) => setSportFilter(e)}
            >
              {sports.map(sport => (
                <Option key={sport} value={sport}>{sport}</Option>
              ))}
            </Select>
            
            <Select 
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e)}
            >
              {statuses.map(status => (
                <Option key={status} value={status}>{status === "All" ? status : status.charAt(0).toUpperCase() + status.slice(1)}</Option>
              ))}
            </Select>

            <Select 
              label="Venue"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e)}
            >
              {venues.map(venue => (
                <Option key={venue} value={venue}>{venue}</Option>
              ))}
            </Select>

            <Input
              type="date"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="!border-white/20 focus:!border-white/40 !bg-white/5"
            />
          </div>
        )}

        {/* Bulk Actions */}
        {selectedEvents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
            <Typography variant="small" color="white">
              {selectedEvents.length} event(s) selected
            </Typography>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="text" 
                color="white"
                className="normal-case"
                onClick={() => handleExport("csv")}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                size="sm" 
                variant="text" 
                color="white"
                className="normal-case"
                onClick={() => setSelectedEvents([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
        </CardHeader>
      </Card>

      {/* Main Content Card */}
      <Card className="border-0 shadow-none overflow-visible -mt-4">
        <CardHeader className="bg-white border-b border-blue-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Typography variant="h6" color="blue-gray">
                Events ({filtered.length})
              </Typography>
              {query && (
                <Chip 
                  value={`Search: "${query}"`} 
                  onClose={() => setQuery("")}
                  className="bg-gray-50 text-gray-700"
                />
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 relative">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={() => setViewMode('table')}
                  className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                    viewMode === 'table' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <TableCellsIcon className="h-4 w-4" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={() => setViewMode('calendar')}
                  className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                    viewMode === 'calendar' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                </IconButton>
                {/* Sliding background */}
                <div 
                  className={`absolute top-1 h-8 w-8 bg-black rounded-md transition-all duration-300 ease-in-out ${
                    viewMode === 'table' ? 'left-1' : 'left-9'
                  }`}
                />
              </div>
              
              {/* Sort Dropdown */}
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button 
                    variant={sortBy === 'date' ? 'filled' : 'outlined'} 
                    size="sm" 
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      sortBy === 'date' 
                        ? 'bg-black text-white border-black hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Sort: {sortBy}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </MenuHandler>
                <MenuList className="z-50">
                  <MenuItem 
                    onClick={() => handleSort('date')}
                    className={sortBy === 'date' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('name')}
                    className={sortBy === 'name' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('participants')}
                    className={sortBy === 'participants' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Participants {sortBy === 'participants' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('host')}
                    className={sortBy === 'host' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Host {sortBy === 'host' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>


        </CardHeader>
        
        {viewMode === "table" ? (
          <CardBody className="p-0 overflow-visible">

            
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed min-w-[1000px]">
                  <thead className="bg-blue-gray-50/50">
                    <tr>
                      <th className="border-b border-blue-gray-100 py-4 px-6 text-left w-16">
                        <Checkbox
                          checked={selectedEvents.length === filtered.length && filtered.length > 0}
                          onChange={handleSelectAll}
                          color="gray"
                        />
                      </th>
                      {[
                        { key: "name", label: "Event", width: "w-64" },
                        { key: "eventType", label: "Type", width: "w-32" },
                        { key: "sport", label: "Sport", width: "w-24" },
                        { key: "date", label: "Date", width: "w-28" },
                        { key: "venue", label: "Venue", width: "w-36" },
                        { key: "host", label: "Host", width: "w-32" },
                        { key: "participants", label: "Participants", width: "w-28" },
                        { key: "status", label: "Status", width: "w-20" },
                        { key: "actions", label: "", width: "w-16" }
                      ].map((col) => (
                        <th key={col.key} className={`border-b border-blue-gray-100 py-4 px-2 text-left ${col.width}`}>
                        <button
                          onClick={() => col.key !== "actions" && handleSort(col.key)}
                          className="flex items-center gap-2 font-semibold text-blue-gray-600 hover:text-blue-gray-800 transition-colors"
                        >
                          <Typography variant="small" className="text-xs font-bold uppercase tracking-wide">
                            {col.label}
                          </Typography>
                          {col.key !== "actions" && (
                            <svg className={`h-3 w-3 transition-transform ${sortBy === col.key && sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="relative">
                {filtered.map((event, idx) => (
                  <tr key={event.id} className="hover:bg-blue-gray-50/50 transition-colors group">
                    <td className={`py-4 px-6 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <Checkbox
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleSelectEvent(event.id)}
                        color="gray"
                      />
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div>
                        <Link href={`/dashboard/events/${event.slug}`}>
                          <Typography variant="small" color="blue-gray" className="font-semibold hover:text-black cursor-pointer transition-colors truncate">
                            {event.name}
                          </Typography>
                        </Link>
                        <Typography variant="small" className="text-blue-gray-500 text-xs mt-1 truncate" title={event.description}>
                          {event.description}
                        </Typography>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-blue-gray-500 flex items-center gap-1" title={`Duration: ${event.duration} hours`}>
                            <ClockIcon className="h-3 w-3" />
                            {event.duration}h
                          </span>
                          <span className="text-xs text-blue-gray-500 flex items-center gap-1" title={`Cost per person: ₱${event.cost.costPerParticipant}`}>
                            <CurrencyDollarIcon className="h-3 w-3" />
                            ₱{event.cost.costPerParticipant}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div title={event.eventType}>
                        <Chip 
                          variant="gradient" 
                          color="gray" 
                          value={event.eventType.length > 12 ? event.eventType.substring(0, 10) + '...' : event.eventType} 
                          className="py-0.5 px-2 text-[11px] font-medium w-fit" 
                        />
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <Chip 
                        variant="gradient" 
                        color="purple" 
                        value={event.sport} 
                        className="py-0.5 px-2 text-[11px] font-medium w-fit" 
                      />
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div title={`${new Date(event.date).toLocaleDateString()} • ${event.startTime} - ${event.endTime}`}>
                        <Typography className="text-sm font-semibold text-blue-gray-700">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500">
                          {event.startTime} - {event.endTime}
                        </Typography>
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div>
                        <Typography className="text-sm font-semibold text-blue-gray-700 truncate">
                          {event.venue.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 truncate">
                          {event.venue.facility}
                        </Typography>
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div className="flex items-center gap-2" title={`Host: ${event.host.fullName} (@${event.host.username})`}>
                        <Avatar src={event.host.avatar} alt={event.host.fullName} size="sm" />
                        <div className="min-w-0 flex-1">
                          <Typography className="text-sm font-semibold text-blue-gray-700 truncate">
                            {event.host.fullName}
                          </Typography>
                          <Typography className="text-xs text-blue-gray-500 truncate">
                            @{event.host.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <div className="text-center" title={`${event.participants.confirmed} confirmed, ${event.participants.pending} pending`}>
                        <Typography className="text-sm font-bold text-blue-gray-700">
                          {event.participants.current}/{event.participants.total}
                        </Typography>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-gray-800 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${(event.participants.current / event.participants.total) * 100}%` }}
                          />
                        </div>
                        <Typography className="text-xs text-blue-gray-500 mt-1">
                          {event.participants.confirmed} confirmed
                        </Typography>
                      </div>
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <StatusChip status={event.status} type="event" />
                    </td>
                    <td className={`py-4 px-2 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <IconButton variant="text" size="sm" color="blue-gray" className="hover:bg-blue-gray-50">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="z-50 min-w-[160px]">
                          <Link href={`/dashboard/events/${event.slug}`}>
                            <MenuItem className="flex items-center gap-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </MenuItem>
                          </Link>
                          <MenuItem className="flex items-center gap-2">
                            <PencilIcon className="h-4 w-4" />
                            Edit Event
                          </MenuItem>
                          <MenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleCancelEvent(event)}>
                            <XMarkIcon className="h-4 w-4" />
                            Cancel Event
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
                </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {filtered.map((event) => (
                <Card key={event.id} className="border border-blue-gray-100 hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link href={`/dashboard/events/${event.slug}`}>
                          <Typography variant="h6" color="blue-gray" className="font-semibold hover:text-black cursor-pointer">
                            {event.name}
                          </Typography>
                        </Link>
                        <Typography variant="small" className="text-blue-gray-500 mt-1">
                          {event.description}
                        </Typography>
                      </div>
                      <Checkbox
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleSelectEvent(event.id)}
                        color="gray"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Chip variant="ghost" color={getEventTypeColor(event.eventType)} value={event.eventType} size="sm" />
                      <Chip variant="ghost" color="purple" value={event.sport} size="sm" />
                      <Chip 
                        variant="ghost" 
                        color={getStatusColor(event.status)} 
                        value={event.status} 
                        size="sm" 
                        className={`capitalize ${
                          event.status === 'completed' ? '!bg-gray-100 !text-gray-600' : ''
                        }`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">Date & Time</Typography>
                        <Typography variant="small" className="font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-500">
                          {event.startTime} - {event.endTime} ({event.duration}h)
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">Participants & Cost</Typography>
                        <Typography variant="small" className="font-semibold">
                          {event.participants.current}/{event.participants.total} • ₱{event.cost.costPerParticipant}
                        </Typography>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-gray-800 h-1 rounded-full" 
                            style={{ width: `${(event.participants.current / event.participants.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={event.host.avatar} alt={event.host.fullName} size="sm" />
                        <div>
                          <Typography variant="small" className="font-semibold">{event.host.fullName}</Typography>
                          <Typography variant="small" className="text-blue-gray-500">{event.venue.name}</Typography>
                        </div>
                      </div>
                      <Menu placement="bottom-end">
                        <MenuHandler>
                          <IconButton variant="text" size="sm" color="blue-gray">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="z-50 min-w-[140px]">
                          <Link href={`/dashboard/events/${event.slug}`}>
                            <MenuItem>View Details</MenuItem>
                          </Link>
                          <MenuItem>Edit Event</MenuItem>
                          <MenuItem className="text-red-600" onClick={() => handleCancelEvent(event)}>Cancel Event</MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        ) : (
          <CardBody className="p-6">
            {/* Functional Calendar View */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Typography variant="h5" color="blue-gray" className="font-bold">
                    {calendarDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric',
                      ...(calendarView === 'day' && { day: 'numeric' })
                    })}
                  </Typography>
                  <div className="flex bg-blue-gray-50 rounded-lg p-1">
                    <Button 
                      variant={calendarView === 'month' ? 'filled' : 'text'} 
                      size="sm" 
                      className="text-xs px-3 py-1"
                      onClick={() => setCalendarView('month')}
                    >
                      Month
                    </Button>
                    <Button 
                      variant={calendarView === 'week' ? 'filled' : 'text'} 
                      size="sm" 
                      className="text-xs px-3 py-1"
                      onClick={() => setCalendarView('week')}
                    >
                      Week
                    </Button>
                    <Button 
                      variant={calendarView === 'day' ? 'filled' : 'text'} 
                      size="sm" 
                      className="text-xs px-3 py-1"
                      onClick={() => setCalendarView('day')}
                    >
                      Day
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton variant="outlined" size="sm" onClick={() => navigateCalendar(-1)}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </IconButton>
                  <Button variant="outlined" size="sm" onClick={goToToday}>Today</Button>
                  <IconButton variant="outlined" size="sm" onClick={() => navigateCalendar(1)}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </IconButton>
                </div>
              </div>
              
              {/* Month View */}
              {calendarView === 'month' && (
                <div className="bg-white rounded-xl border border-blue-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-7 bg-blue-gray-50">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="p-4 text-center border-r border-blue-gray-200 last:border-r-0">
                        <Typography variant="small" className="font-semibold text-blue-gray-700 uppercase tracking-wide">
                          {day.slice(0, 3)}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {getCalendarDays().map((date, i) => {
                      const isCurrentMonth = date.getMonth() === calendarDate.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      const dayEvents = getEventsForDate(date);
                      
                      return (
                        <div key={i} className={`min-h-[120px] p-3 border-r border-b border-blue-gray-200 last:border-r-0 ${
                          isCurrentMonth ? 'bg-white hover:bg-blue-gray-50' : 'bg-blue-gray-25'
                        } ${isToday ? 'bg-blue-50' : ''} transition-colors cursor-pointer`}>
                          <div className="flex items-center justify-between mb-2">
                            <Typography variant="small" className={`font-semibold ${
                              isToday ? 'text-black' : dayEvents.length > 0 ? 'text-blue-gray-800' : 'text-blue-gray-600'
                            }`}>
                              {date.getDate()}
                            </Typography>
                            {isToday && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          {dayEvents.length > 0 && (
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event, idx) => (
                                <Link key={idx} href={`/dashboard/events/${event.slug}`}>
                                  <div className={`${getSportColor(event.sport)} rounded px-2 py-1 text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity`}>
                                    {event.name}
                                  </div>
                                </Link>
                              ))}
                              {dayEvents.length > 2 && (
                                <Typography variant="small" className="text-blue-gray-500 text-xs">
                                  +{dayEvents.length - 2} more
                                </Typography>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Week View */}
              {calendarView === 'week' && (
                <div className="bg-white rounded-xl border border-blue-gray-200 overflow-hidden">
                  <div className="grid grid-cols-8 bg-blue-gray-50">
                    <div className="p-4 border-r border-blue-gray-200">
                      <Typography variant="small" className="font-semibold text-blue-gray-700">Time</Typography>
                    </div>
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date(calendarDate);
                      date.setDate(date.getDate() - date.getDay() + i);
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div key={i} className="p-4 text-center border-r border-blue-gray-200 last:border-r-0">
                          <Typography variant="small" className="font-semibold text-blue-gray-700 uppercase tracking-wide">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </Typography>
                          <Typography variant="small" className={`${isToday ? 'text-black font-bold' : 'text-blue-gray-600'}`}>
                            {date.getDate()}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Time slots */}
                  {Array.from({ length: 12 }, (_, hour) => {
                    const timeSlot = hour + 8; // 8 AM to 8 PM
                    return (
                      <div key={hour} className="grid grid-cols-8 border-b border-blue-gray-100">
                        <div className="p-3 border-r border-blue-gray-200 bg-blue-gray-25">
                          <Typography variant="small" className="text-blue-gray-600">
                            {timeSlot}:00
                          </Typography>
                        </div>
                        {Array.from({ length: 7 }, (_, day) => {
                          const date = new Date(calendarDate);
                          date.setDate(date.getDate() - date.getDay() + day);
                          const dayEvents = getEventsForDate(date).filter(event => {
                            const eventHour = parseInt(event.startTime.split(':')[0]);
                            return eventHour === timeSlot;
                          });
                          
                          return (
                            <div key={day} className="p-2 border-r border-blue-gray-200 last:border-r-0 min-h-[60px]">
                              {dayEvents.map((event, idx) => (
                                <Link key={idx} href={`/dashboard/events/${event.slug}`}>
                                  <div className={`${getSportColor(event.sport)} rounded px-2 py-1 text-xs font-medium mb-1 cursor-pointer hover:opacity-80 transition-opacity`}>
                                    {event.name}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Day View */}
              {calendarView === 'day' && (
                <div className="bg-white rounded-xl border border-blue-gray-200 overflow-hidden">
                  <div className="bg-blue-gray-50 p-4 border-b border-blue-gray-200">
                    <Typography variant="h6" className="font-semibold text-blue-gray-700">
                      {calendarDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Typography>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, hour) => {
                      const timeSlot = hour + 8; // 8 AM to 8 PM
                      const dayEvents = getEventsForDate(calendarDate).filter(event => {
                        const eventHour = parseInt(event.startTime.split(':')[0]);
                        return eventHour === timeSlot;
                      });
                      
                      return (
                        <div key={hour} className="flex border-b border-blue-gray-100">
                          <div className="w-20 p-3 border-r border-blue-gray-200 bg-blue-gray-25">
                            <Typography variant="small" className="text-blue-gray-600">
                              {timeSlot}:00
                            </Typography>
                          </div>
                          <div className="flex-1 p-3 min-h-[80px]">
                            {dayEvents.map((event, idx) => (
                              <Link key={idx} href={`/dashboard/events/${event.slug}`}>
                                <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow">
                                  <CardBody className="p-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-3 h-3 rounded-full ${getSportColor(event.sport).replace('bg-', 'bg-').replace('text-', '').split(' ')[0]}`}></div>
                                      <div className="flex-1">
                                        <Typography variant="small" className="font-semibold">{event.name}</Typography>
                                        <Typography variant="small" className="text-blue-gray-500">
                                          {event.startTime} - {event.endTime} • {event.venue.name}
                                        </Typography>
                                      </div>
                                      <Chip variant="ghost" color={getEventTypeColor(event.eventType)} value={event.eventType} size="sm" />
                                    </div>
                                  </CardBody>
                                </Card>
                              </Link>
                            ))}
                            {dayEvents.length === 0 && (
                              <Typography variant="small" className="text-blue-gray-400 italic">
                                No events scheduled
                              </Typography>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Enhanced Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Typography variant="small" className="font-semibold text-blue-gray-700">Sports:</Typography>
                <div className="flex flex-wrap items-center gap-4">
                  {['Basketball', 'Volleyball', 'Football', 'Tennis', 'Badminton', 'Swimming'].map(sport => (
                    <div key={sport} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${getSportColor(sport).split(' ')[0]}`}></div>
                      <span className="text-sm text-blue-gray-600">{sport}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        )}
      </Card>

      {/* Enhanced Add Event Dialog */}
      <Dialog 
        open={showAddEventDialog} 
        handler={() => setShowAddEventDialog(false)}
        size="xxl"
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h4" color="white" className="font-bold">
                  Create New Event
                </Typography>
                <Typography variant="small" className="text-white/90 mt-1">
                  Set up a new sports event for your community
                </Typography>
              </div>
              <IconButton
                variant="text"
                color="white"
                onClick={() => setShowAddEventDialog(false)}
                className="hover:bg-white/10"
              >
                <XMarkIcon className="h-6 w-6" />
              </IconButton>
            </div>
          </div>

          <DialogBody className="p-6">
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Basic Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input 
                      label="Event Name" 
                      size="lg"
                      placeholder="e.g., Basketball 5v5 Pickup Game"
                    />
                  </div>
                  <Select label="Event Type" size="lg">
                    <Option value="Free For All">🏃 Free For All</Option>
                    <Option value="Team vs Team">⚔️ Team vs Team</Option>
                    <Option value="Tournament">🏆 Tournament</Option>
                    <Option value="Training">🎯 Training Session</Option>
                    <Option value="Scrimmage">🤝 Scrimmage</Option>
                    <Option value="League">🏅 League Match</Option>
                  </Select>
                  <Select label="Sport" size="lg">
                    <Option value="Basketball">🏀 Basketball</Option>
                    <Option value="Volleyball">🏐 Volleyball</Option>
                    <Option value="Football">⚽ Football</Option>
                    <Option value="Tennis">🎾 Tennis</Option>
                    <Option value="Badminton">🏸 Badminton</Option>
                    <Option value="Swimming">🏊 Swimming</Option>
                  </Select>
                </div>
              </div>

              {/* Schedule & Location */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Schedule & Location
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input type="date" label="Event Date" size="lg" />
                  <Input type="time" label="Start Time" size="lg" />
                  <Input type="time" label="End Time" size="lg" />
                  <div className="md:col-span-2">
                    <Select label="Venue" size="lg">
                      <Option value="GG Arena">🏟️ GG Arena - Makati</Option>
                      <Option value="Quest Hub">🎯 Quest Hub - Cebu</Option>
                      <Option value="Sports Central">⭐ Sports Central - Quezon City</Option>
                    </Select>
                  </div>
                  <Input type="number" label="Max Participants" size="lg" placeholder="10" />
                </div>
              </div>

              {/* Event Details */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Event Details
                </Typography>
                <div className="space-y-4">
                  <textarea 
                    className="w-full p-4 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    rows="4" 
                    placeholder="Describe your event... Include skill level, what to bring, special rules, etc."
                  />
                  
                  {/* Event Rules */}
                  <div>
                    <Typography variant="small" className="font-semibold text-blue-gray-700 mb-2">
                      Event Rules (Optional)
                    </Typography>
                    <div className="space-y-2">
                      <Input label="Rule 1" placeholder="e.g., Arrive 15 minutes early" />
                      <Input label="Rule 2" placeholder="e.g., Bring your own water" />
                      <Input label="Rule 3" placeholder="e.g., No aggressive play" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Information */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  Cost Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Facility Cost per Hour" 
                    size="lg"
                    placeholder="1500"
                    icon={<span className="text-blue-gray-500">₱</span>}
                  />
                  <div className="bg-blue-gray-50 rounded-lg p-4">
                    <Typography variant="small" className="text-blue-gray-600 mb-2">Cost Preview</Typography>
                    <Typography variant="h6" color="blue-gray">₱300 per person</Typography>
                    <Typography variant="small" className="text-blue-gray-500">Based on 2 hours, 10 participants</Typography>
                  </div>
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="bg-blue-gray-50 p-6 rounded-b-xl">
            <div className="flex items-center justify-between w-full">
              <Typography variant="small" className="text-blue-gray-600">
                Event will be visible to all users once created
              </Typography>
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  onClick={() => setShowAddEventDialog(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    alert("Event created successfully!");
                    setShowAddEventDialog(false);
                  }}
                  className="px-6 bg-gradient-to-r from-gray-800 to-black text-white"
                >
                  Create Event
                </Button>
              </div>
            </div>
          </DialogFooter>
        </Card>
      </Dialog>

      {/* Cancel Event Dialog */}
      <Dialog 
        open={showCancelDialog} 
        handler={() => setShowCancelDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Cancel Event
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowCancelDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to cancel <strong>{eventToCancel?.name}</strong>? This will notify all participants.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowCancelDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              alert("Event cancelled successfully!");
              setShowCancelDialog(false);
              setEventToCancel(null);
            }}
          >
            Cancel Event
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Events;
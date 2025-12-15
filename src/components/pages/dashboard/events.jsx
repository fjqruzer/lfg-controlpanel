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
  Textarea,
} from "@/components/ui";
import { 
  CalendarDaysIcon,
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
  EyeIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useNotifications } from "@/context/notifications";
import { getUserAvatarUrl, getVenuePhotoUrl } from "@/lib/imageUrl";
import {
  getAdminEvents,
  getAdminEvent,
  getAdminEventParticipants,
  updateAdminEvent,
} from "@/services/adminEventService";
import { exportEvents } from "@/services/adminExportService";

const eventTypes = ["All", "Free For All", "Team vs Team", "Tournament", "Training", "Scrimmage", "League", "Friendly"];
const statuses = ["All", "upcoming", "ongoing", "completed", "cancelled"];

export function Events() {
  const { notify } = useNotifications();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  
  // Dialog states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Calendar states
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");

  // Load events from admin service
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        page,
        per_page: perPage,
      };
      const res = await getAdminEvents(params);
      // Laravel paginate() returns { current_page, data, from, last_page, ... total }
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setEvents(list);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
        from: res.from,
        to: res.to,
      });
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Failed to load events');
      notify('Failed to load events', { color: 'red', icon: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadEvents();
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(e => e.id));
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

  const handleCancelClick = (event) => {
    setEventToCancel(event);
    setCancelReason("");
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!eventToCancel) return;
    try {
      setActionLoading(true);
      await updateAdminEvent(eventToCancel.id, { 
        status: 'cancelled',
        cancellation_reason: cancelReason 
      });
      notify('Event cancelled successfully', { color: 'green' });
      setShowCancelDialog(false);
      setEventToCancel(null);
      setCancelReason("");
      loadEvents();
    } catch (err) {
      notify(err.message || 'Failed to cancel event', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = async (event) => {
    try {
      const fullEvent = await getAdminEvent(event.id);
      setCurrentEvent(fullEvent);
      setShowEditDialog(true);
    } catch (err) {
      notify(err.message || 'Failed to load event details', { color: 'red' });
    }
  };

  const handleEditSave = async () => {
    if (!currentEvent) return;
    try {
      setActionLoading(true);
      await updateAdminEvent(currentEvent.id, {
        name: currentEvent.name,
        description: currentEvent.description,
        status: currentEvent.status,
      });
      notify('Event updated successfully', { color: 'green' });
      setShowEditDialog(false);
      setCurrentEvent(null);
      loadEvents();
    } catch (err) {
      notify(err.message || 'Failed to update event', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportEvents();
      notify('Export started', { color: 'green' });
    } catch (err) {
      notify(err.message || 'Export failed', { color: 'red' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "blue";
      case "ongoing": return "green";
      case "completed": return "blue-gray";
      case "cancelled": return "red";
      default: return "blue-gray";
    }
  };

  // Calendar helper functions
  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
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
    return events.filter(event => {
      const eventDate = event.scheduled_at || event.date || event.start_date;
      if (!eventDate) return false;
      return eventDate.substring(0, 10) === dateStr;
    });
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
                Monitor and manage sports events (read-only admin view)
              </Typography>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <Typography variant="small" className="text-white/70">Total Events</Typography>
                  <Typography variant="h6" color="white">{pagination?.total || events.length}</Typography>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <Typography variant="small" className="text-white/70">Upcoming</Typography>
                  <Typography variant="h6" color="white">
                    {events.filter(e => e.status === 'upcoming').length}
                  </Typography>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <Typography variant="small" className="text-white/70">Ongoing</Typography>
                  <Typography variant="h6" color="white">
                    {events.filter(e => e.status === 'ongoing').length}
                  </Typography>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <Typography variant="small" className="text-white/70">Completed</Typography>
                  <Typography variant="h6" color="white">
                    {events.filter(e => e.status === 'completed').length}
                  </Typography>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 lg:w-80">
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  label="Search events, hosts, venues..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  className="!border-white/20 focus:!border-white/40 !bg-white/5"
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-white/50" />}
                />
              </form>
              
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
                  variant="outlined" 
                  color="white"
                  className="flex-1 border-white/20 text-white hover:bg-white/5 flex items-center justify-center"
                  onClick={handleExport}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2 text-white -mt-0.5" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select 
                label="Event Type"
                value={eventTypeFilter}
                onChange={(e) => { setEventTypeFilter(e); setPage(1); }}
              >
                {eventTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
              
              <Select 
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e); setPage(1); }}
              >
                {statuses.map(status => (
                  <Option key={status} value={status}>
                    {status === "All" ? status : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
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
                  onClick={handleExport}
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
                Events ({events.length})
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
                    variant="outlined"
                    size="sm" 
                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-gray-400"
                  >
                    Sort: {sortBy}
                    <ChevronUpDownIcon className="h-4 w-4" />
                  </Button>
                </MenuHandler>
                <MenuList className="z-50">
                  <MenuItem 
                    onClick={() => handleSort('id')}
                    className={sortBy === 'id' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('name')}
                    className={sortBy === 'name' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSort('created_at')}
                    className={sortBy === 'created_at' ? 'bg-gray-100 font-semibold' : ''}
                  >
                    Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </CardHeader>
        
        {error && (
          <div className="px-6 pt-4">
            <Typography variant="small" className="text-red-500 font-medium">
              {error}
            </Typography>
          </div>
        )}

        {loading ? (
          <CardBody className="text-center py-8">
            <Typography className="text-blue-gray-400">Loading events...</Typography>
          </CardBody>
        ) : viewMode === "table" ? (
          <CardBody className="p-0 overflow-visible">
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[900px]">
                <thead className="bg-blue-gray-50/50">
                  <tr>
                    <th className="border-b border-blue-gray-100 py-4 px-6 text-left w-16">
                      <Checkbox
                        checked={selectedEvents.length === events.length && events.length > 0}
                        onChange={handleSelectAll}
                        color="gray"
                      />
                    </th>
                    {[
                      { key: "name", label: "Event" },
                      { key: "host", label: "Host" },
                      { key: "venue", label: "Venue" },
                      { key: "scheduled_at", label: "Date" },
                      { key: "participants", label: "Participants" },
                      { key: "status", label: "Status" },
                      { key: "actions", label: "" }
                    ].map((col) => (
                      <th key={col.key} className="border-b border-blue-gray-100 py-4 px-4 text-left">
                        <button
                          onClick={() => col.key !== "actions" && handleSort(col.key)}
                          className="flex items-center gap-2 font-semibold text-blue-gray-600 hover:text-blue-gray-800 transition-colors"
                        >
                          <Typography variant="small" className="text-xs font-bold uppercase tracking-wide">
                            {col.label}
                          </Typography>
                          {col.key !== "actions" && col.key !== "participants" && (
                            <ChevronUpDownIcon className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 px-5 text-center text-blue-gray-400">
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    events.map((event, idx) => (
                      <tr key={event.id} className="hover:bg-blue-gray-50/50 transition-colors">
                        <td className={`py-4 px-6 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            color="gray"
                          />
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <div>
                            <Link href={`/dashboard/events/${event.id}`}>
                              <Typography variant="small" color="blue-gray" className="font-semibold hover:text-black cursor-pointer transition-colors">
                                {event.name || event.title || `Event #${event.id}`}
                              </Typography>
                            </Link>
                            <Typography variant="small" className="text-blue-gray-500 text-xs mt-1">
                              ID: {event.id}
                            </Typography>
                          </div>
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <div className="flex items-center gap-2">
                            <Avatar 
                              src={getUserAvatarUrl(event.creator || event.host || event.organizer)} 
                              alt={event.creator?.username || event.host?.name || 'Host'} 
                              size="sm" 
                            />
                            <div>
                              <Typography className="text-sm font-semibold text-blue-gray-700">
                                {event.host?.name || event.organizer?.name || '—'}
                              </Typography>
                              <Typography className="text-xs text-blue-gray-500">
                                @{event.host?.username || event.organizer?.username || '—'}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <div>
                            <Typography className="text-sm font-semibold text-blue-gray-700">
                              {event.venue?.name || event.location || '—'}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-500">
                              {event.venue?.address || ''}
                            </Typography>
                          </div>
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <div>
                            <Typography className="text-sm font-semibold text-blue-gray-700">
                              {event.scheduled_at || event.start_date 
                                ? new Date(event.scheduled_at || event.start_date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '—'
                              }
                            </Typography>
                            <Typography className="text-xs text-blue-gray-500">
                              {event.start_time || '—'}
                            </Typography>
                          </div>
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <div className="text-center">
                            <Typography className="text-sm font-bold text-blue-gray-700">
                              {event.participants_count || event.current_participants || 0}
                              {event.max_participants ? `/${event.max_participants}` : ''}
                            </Typography>
                            {event.max_participants && (
                              <div className="w-16 bg-gray-200 rounded-full h-1 mt-1 mx-auto">
                                <div 
                                  className="bg-gray-800 h-1 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${Math.min(100, ((event.participants_count || 0) / event.max_participants) * 100)}%` 
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <Chip 
                            variant="ghost" 
                            color={getStatusColor(event.status)} 
                            value={event.status || 'unknown'} 
                            className="py-0.5 px-2 text-[10px] font-medium w-fit capitalize" 
                          />
                        </td>
                        <td className={`py-4 px-4 ${idx !== events.length - 1 ? "border-b border-blue-gray-100" : ""}`}>
                          <Menu placement="bottom-end">
                            <MenuHandler>
                              <IconButton variant="text" size="sm" color="blue-gray" className="hover:bg-blue-gray-50">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList className="z-50 min-w-[160px]">
                              <Link href={`/dashboard/events/${event.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </MenuItem>
                              </Link>
                              <MenuItem className="flex items-center gap-2" onClick={() => handleEditClick(event)}>
                                <PencilIcon className="h-4 w-4" />
                                Edit Event
                              </MenuItem>
                              {event.status !== 'cancelled' && event.status !== 'completed' && (
                                <MenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleCancelClick(event)}>
                                  <XMarkIcon className="h-4 w-4" />
                                  Cancel Event
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between p-4 border-t border-blue-gray-100">
                <Typography variant="small" className="text-blue-gray-600">
                  Page {pagination.current_page || page} of {pagination.last_page || 1} • Total {pagination.total || events.length} events
                </Typography>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    disabled={pagination && page >= pagination.last_page}
                    onClick={() => setPage((p) => pagination ? Math.min(pagination.last_page, p + 1) : p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        ) : (
          <CardBody className="p-6">
            {/* Calendar View */}
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
                  <div className="grid grid-cols-7 bg-blue-gray-50">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="p-4 text-center border-r border-blue-gray-200 last:border-r-0">
                        <Typography variant="small" className="font-semibold text-blue-gray-700 uppercase tracking-wide">
                          {day.slice(0, 3)}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  
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
                                <Link key={idx} href={`/dashboard/events/${event.id}`}>
                                  <div className={`${getSportColor(event.sport || 'default')} rounded px-2 py-1 text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity`}>
                                    {event.name || event.title || `Event #${event.id}`}
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
                  
                  {Array.from({ length: 12 }, (_, hour) => {
                    const timeSlot = hour + 8;
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
                          const dayEvents = getEventsForDate(date);
                          
                          return (
                            <div key={day} className="p-2 border-r border-blue-gray-200 last:border-r-0 min-h-[60px]">
                              {dayEvents.slice(0, 1).map((event, idx) => (
                                <Link key={idx} href={`/dashboard/events/${event.id}`}>
                                  <div className={`${getSportColor(event.sport || 'default')} rounded px-2 py-1 text-xs font-medium mb-1 cursor-pointer hover:opacity-80 transition-opacity truncate`}>
                                    {event.name || event.title}
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
                    {getEventsForDate(calendarDate).length === 0 ? (
                      <div className="p-6 text-center">
                        <Typography variant="small" className="text-blue-gray-400">
                          No events scheduled for this day
                        </Typography>
                      </div>
                    ) : (
                      getEventsForDate(calendarDate).map((event, idx) => (
                        <Link key={idx} href={`/dashboard/events/${event.id}`}>
                          <Card className="m-4 cursor-pointer hover:shadow-md transition-shadow">
                            <CardBody className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Typography variant="h6" className="font-semibold">
                                    {event.name || event.title}
                                  </Typography>
                                  <Typography variant="small" className="text-blue-gray-500">
                                    {event.venue?.name || event.location || '—'}
                                  </Typography>
                                </div>
                                <Chip 
                                  variant="ghost" 
                                  color={getStatusColor(event.status)} 
                                  value={event.status} 
                                  size="sm" 
                                  className="capitalize"
                                />
                              </div>
                            </CardBody>
                          </Card>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        )}
      </Card>

      {/* Edit Event Dialog */}
      <Dialog 
        open={showEditDialog} 
        handler={() => setShowEditDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Edit Event
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowEditDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          {currentEvent && (
            <>
              <Input 
                label="Event Name" 
                value={currentEvent.name || currentEvent.title || ''} 
                onChange={(e) => setCurrentEvent({...currentEvent, name: e.target.value})}
              />
              <Textarea 
                label="Description" 
                value={currentEvent.description || ''} 
                onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                rows={3}
              />
              <Select 
                label="Status"
                value={currentEvent.status || 'upcoming'}
                onChange={(val) => setCurrentEvent({...currentEvent, status: val})}
              >
                <Option value="upcoming">Upcoming</Option>
                <Option value="ongoing">Ongoing</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowEditDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color="gray"
            onClick={handleEditSave}
            disabled={actionLoading}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
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
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to cancel <strong>{eventToCancel?.name || eventToCancel?.title}</strong>? 
            This will notify all participants.
          </Typography>
          <Textarea
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Explain why this event is being cancelled..."
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowCancelDialog(false)}
            disabled={actionLoading}
          >
            Go Back
          </Button>
          <Button
            color="red"
            onClick={handleCancelConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? 'Cancelling...' : 'Cancel Event'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Events;

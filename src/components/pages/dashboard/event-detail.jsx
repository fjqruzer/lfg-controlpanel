"use client";

import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Avatar,
  Button,
  IconButton,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@/components/ui";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { getEventBySlug } from "@/services/eventService";

export function EventDetail({ params }) {
  // Unwrap the params Promise using React.use() for Next.js 16
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams || {};
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("details");

  React.useEffect(() => {
    // Load event from service
    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug);
        setEvent(data);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      loadEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6 text-center">
            <Typography variant="h6" color="blue-gray">Loading event...</Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">Event not found</Typography>
            <Typography variant="small" className="text-blue-gray-600 mb-4">We couldn't locate that event. It may have been cancelled or removed.</Typography>
            <Link href="/dashboard/events">
              <Button variant="outlined">Back to Events</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "blue";
      case "ongoing": return "green";
      case "completed": return "gray";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "Free For All": return "blue";
      case "Team vs Team": return "purple";
      case "Tournament": return "amber";
      case "Training": return "green";
      default: return "gray";
    }
  };

  const getParticipantStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "green";
      case "pending": return "amber";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <>
      {/* Enhanced Hero Section */}
      <div className="relative mt-8 h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border border-white rounded-full"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Chip 
                value={event.eventType} 
                color={getEventTypeColor(event.eventType)} 
                className="text-white bg-white/20 backdrop-blur-sm border-white/30"
              />
              <Chip 
                value={event.sport} 
                color="purple" 
                className="text-white bg-white/20 backdrop-blur-sm border-white/30"
              />
              <Chip 
                value={event.status} 
                color={getStatusColor(event.status)} 
                className="text-white bg-white/20 backdrop-blur-sm border-white/30 capitalize"
              />
            </div>
            

          </div>
          
          {/* Main Content */}
          <div className="pb-8">
            <Typography variant="h3" className="mb-4">
              {event.name}
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <Typography variant="small" className="font-semibold">Date & Time</Typography>
                </div>
                <Typography variant="h6" className="mb-1">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
                <Typography variant="small" className="opacity-90">
                  {event.startTime} - {event.endTime} ({event.duration}h)
                </Typography>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <MapPinIcon className="h-5 w-5" />
                  <Typography variant="small" className="font-semibold">Location</Typography>
                </div>
                <Typography variant="h6" className="mb-1">{event.venue.name}</Typography>
                <Typography variant="small" className="opacity-90">{event.venue.facility}</Typography>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <Typography variant="small" className="font-semibold">Participants</Typography>
                </div>
                <Typography variant="h6" className="mb-1">
                  {event.participants.current}/{event.participants.total}
                </Typography>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.participants.current / event.participants.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <Card className="mx-3 -mt-12 mb-6 lg:mx-4 border-0 shadow-2xl">
        <CardBody className="p-8">
          
          {/* Enhanced Header with Actions */}
          <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar src={event.host.avatar} alt={event.host.fullName} size="xl" className="ring-4 ring-white shadow-lg" />
                </div>
                <div>
                  <Typography variant="h5" color="blue-gray" className="font-bold mb-1">
                    Hosted by {event.host.fullName}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600 mb-1">
                    @{event.host.username}
                  </Typography>
                  <div className="flex items-center gap-4 text-sm text-blue-gray-500">
                    <span>Created {new Date(event.createdDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      4.8 Host Rating
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="gradient" color="blue" className="flex items-center gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Edit Event
                </Button>
                <Button variant="outlined" color="green" className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  Contact Host
                </Button>
                <Button variant="outlined" color="red" className="flex items-center gap-2">
                  <XMarkIcon className="h-4 w-4" />
                  Cancel Event
                </Button>
                <Link href="/dashboard/events">
                  <Button variant="text" color="blue-gray" className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-blue-gray-100">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <Typography variant="h4" color="blue-gray">
                  {event.participants.current}/{event.participants.total}
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">Participants</Typography>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-700 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(event.participants.current / event.participants.total) * 100}%` }}
                  />
                </div>
                <Typography variant="small" className="text-gray-700 mt-2 font-medium">
                  {Math.round((event.participants.current / event.participants.total) * 100)}% Full
                </Typography>
              </CardBody>
            </Card>
            
            <Card className="border border-blue-gray-100">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">₱</span>
                </div>
                <Typography variant="h4" color="blue-gray">
                  ₱{event.cost.costPerParticipant}
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">Cost per Person</Typography>
                <Typography variant="small" className="text-blue-gray-600 font-medium">
                  Total: ₱{event.cost.totalCost.toLocaleString()}
                </Typography>
              </CardBody>
            </Card>
            
            <Card className="border border-blue-gray-100">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <Typography variant="h4" color="blue-gray">
                  {event.duration}h
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">Duration</Typography>
                <Typography variant="small" className="text-blue-gray-600 font-medium">
                  {event.startTime} - {event.endTime}
                </Typography>
              </CardBody>
            </Card>
            
            <Card className="border border-blue-gray-100">
              <CardBody className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <Typography variant="h4" color="blue-gray">
                  {event.checkIns?.total || 0}
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">Checked In</Typography>
                <Typography variant="small" className="text-blue-gray-600 font-medium">
                  {event.participants.confirmed > 0 ? Math.round(((event.checkIns?.total || 0) / event.participants.confirmed) * 100) : 0}% Attendance
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} className="mb-8">
            <TabsHeader className="bg-gray-100 p-1 rounded-xl">
              <Tab 
                value="details" 
                onClick={() => setActiveTab("details")}
                className="flex items-center gap-2 font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Event Details
              </Tab>
              <Tab 
                value="participants" 
                onClick={() => setActiveTab("participants")}
                className="flex items-center gap-2 font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Participants ({event.participants.current})
              </Tab>
              <Tab 
                value="cost" 
                onClick={() => setActiveTab("cost")}
                className="flex items-center gap-2 font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cost Breakdown
              </Tab>
              <Tab 
                value="checkins" 
                onClick={() => setActiveTab("checkins")}
                className="flex items-center gap-2 font-medium"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Check-ins ({event.checkIns?.total || 0})
              </Tab>
            </TabsHeader>
            <TabsBody>
              
              {/* Event Details Tab */}
              <TabPanel value="details">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    
                    {/* Description */}
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-3">Description</Typography>
                      <Typography variant="paragraph" className="text-blue-gray-600">
                        {event.description}
                      </Typography>
                    </div>

                    {/* Event Information */}
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-3">Event Information</Typography>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Event Type:</Typography>
                          <Chip value={event.eventType} color={getEventTypeColor(event.eventType)} size="sm" />
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Sport:</Typography>
                          <Chip value={event.sport} color="purple" size="sm" />
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Date:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">{new Date(event.date).toLocaleDateString()}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Time:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">{event.startTime} - {event.endTime}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Duration:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">{event.duration} hours</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="small" className="font-medium">Status:</Typography>
                          <Chip value={event.status} color={getStatusColor(event.status)} size="sm" className="capitalize" />
                        </div>
                      </div>
                    </div>

                    {/* Rules */}
                    {event.rules && event.rules.length > 0 && (
                      <div>
                        <Typography variant="h6" color="blue-gray" className="mb-3">Event Rules</Typography>
                        <ul className="space-y-2">
                          {event.rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <Typography variant="small" className="text-blue-gray-600">{rule}</Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    
                    {/* Venue Information */}
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-3">Venue & Location</Typography>
                      <Card className="border border-blue-gray-100">
                        <CardBody className="p-4">
                          <Typography variant="h6" color="blue-gray" className="mb-2">{event.venue.name}</Typography>
                          <Typography variant="small" className="text-blue-gray-600 mb-2">{event.venue.facility}</Typography>
                          <Typography variant="small" className="text-blue-gray-600 mb-3">{event.venue.address}</Typography>
                          {event.venue.mapUrl && (
                            <a 
                              href={event.venue.mapUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              Open in Google Maps
                            </a>
                          )}
                        </CardBody>
                      </Card>
                    </div>

                    {/* Host Information */}
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-3">Host Information</Typography>
                      <Card className="border border-blue-gray-100">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar src={event.host.avatar} alt={event.host.fullName} size="md" />
                            <div>
                              <Typography variant="small" className="font-semibold">{event.host.fullName}</Typography>
                              <Typography variant="small" className="text-blue-gray-600">@{event.host.username}</Typography>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Typography variant="small" className="text-blue-gray-600">{event.host.email}</Typography>
                            <Typography variant="small" className="text-blue-gray-600">{event.host.phone}</Typography>
                          </div>
                          <div className="mt-3">
                            <Button variant="outlined" size="sm" fullWidth>
                              <EnvelopeIcon className="h-4 w-4 mr-2" />
                              Contact Host
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                  </div>
                </div>
              </TabPanel>

              {/* Participants Tab */}
              <TabPanel value="participants">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" color="blue-gray">
                      Participants ({event.participants.current}/{event.participants.total})
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Chip value={`${event.participants.confirmed} confirmed`} color="green" size="sm" />
                      <Chip value={`${event.participants.pending} pending`} color="amber" size="sm" />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-blue-gray-100">
                          <th className="text-left py-3 px-4">
                            <Typography variant="small" className="font-semibold text-blue-gray-600">Participant</Typography>
                          </th>
                          <th className="text-left py-3 px-4">
                            <Typography variant="small" className="font-semibold text-blue-gray-600">Status</Typography>
                          </th>
                          <th className="text-left py-3 px-4">
                            <Typography variant="small" className="font-semibold text-blue-gray-600">Joined Date</Typography>
                          </th>
                          <th className="text-left py-3 px-4">
                            <Typography variant="small" className="font-semibold text-blue-gray-600">Actions</Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.participantsList.map((participant) => (
                          <tr key={participant.id} className="border-b border-blue-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar src={participant.avatar} alt={participant.fullName} size="sm" />
                                <div>
                                  <Typography variant="small" className="font-semibold">{participant.fullName}</Typography>
                                  <Typography variant="small" className="text-blue-gray-600">@{participant.username}</Typography>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Chip 
                                value={participant.status} 
                                color={getParticipantStatusColor(participant.status)} 
                                size="sm" 
                                className="capitalize"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Typography variant="small" className="text-blue-gray-600">
                                {new Date(participant.joinedDate).toLocaleDateString()}
                              </Typography>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <IconButton variant="text" size="sm" color="blue">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </IconButton>
                                <IconButton variant="text" size="sm" color="red">
                                  <XMarkIcon className="h-4 w-4" />
                                </IconButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>

              {/* Cost Breakdown Tab */}
              <TabPanel value="cost">
                <div className="max-w-md mx-auto">
                  <Typography variant="h6" color="blue-gray" className="mb-6 text-center">Cost Breakdown</Typography>
                  
                  <Card className="border border-blue-gray-100">
                    <CardBody className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Typography variant="small" className="font-medium">Facility Rate:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">₱{event.cost.facilityPricePerHour.toLocaleString()}/hour</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" className="font-medium">Duration:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">{event.cost.totalHours} hours</Typography>
                        </div>
                        <div className="flex justify-between items-center border-t border-blue-gray-100 pt-4">
                          <Typography variant="small" className="font-semibold">Total Cost:</Typography>
                          <Typography variant="small" className="font-semibold">₱{event.cost.totalCost.toLocaleString()}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" className="font-medium">Participants:</Typography>
                          <Typography variant="small" className="text-blue-gray-600">{event.participants.current} people</Typography>
                        </div>
                        <div className="flex justify-between items-center border-t border-blue-gray-100 pt-4">
                          <Typography variant="h6" color="green">Cost per Person:</Typography>
                          <Typography variant="h6" color="green">₱{event.cost.costPerParticipant}</Typography>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </TabPanel>

              {/* Check-ins Tab */}
              <TabPanel value="checkins">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="h6" color="blue-gray">
                      Check-ins ({event.checkIns?.total || 0}/{event.participants.confirmed})
                    </Typography>
                    <Progress 
                      value={((event.checkIns?.total || 0) / event.participants.confirmed) * 100} 
                      color="green" 
                      className="w-32"
                    />
                  </div>
                  
                  {event.checkIns?.list && event.checkIns.list.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-blue-gray-100">
                            <th className="text-left py-3 px-4">
                              <Typography variant="small" className="font-semibold text-blue-gray-600">Participant</Typography>
                            </th>
                            <th className="text-left py-3 px-4">
                              <Typography variant="small" className="font-semibold text-blue-gray-600">Check-in Time</Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {event.checkIns.list.map((checkIn) => (
                            <tr key={checkIn.id} className="border-b border-blue-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar src={`https://i.pravatar.cc/80?img=${checkIn.id}`} alt={checkIn.fullName} size="sm" />
                                  <div>
                                    <Typography variant="small" className="font-semibold">{checkIn.fullName}</Typography>
                                    <Typography variant="small" className="text-blue-gray-600">@{checkIn.username}</Typography>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Typography variant="small" className="text-blue-gray-600">
                                  {new Date(checkIn.checkedInAt).toLocaleTimeString()}
                                </Typography>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Typography variant="small" className="text-blue-gray-600">No check-ins yet</Typography>
                    </div>
                  )}
                </div>
              </TabPanel>

            </TabsBody>
          </Tabs>

        </CardBody>
      </Card>
    </>
  );
}

export default EventDetail;
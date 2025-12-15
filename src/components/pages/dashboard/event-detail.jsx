"use client";

import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Avatar,
  Button,
} from "@/components/ui";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { getAdminEvent, getAdminEventParticipants } from "@/services/adminEventService";
import { getVenuePhotoUrl, getUserAvatarUrl } from "@/lib/imageUrl";

export function EventDetail({ params }) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams || {};
  const [event, setEvent] = React.useState(null);
  const [participants, setParticipants] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");
        // slug is the event ID for admin routes
        const data = await getAdminEvent(slug);
        setEvent(data.event || data);
        
        // Load participants
        try {
          const participantsData = await getAdminEventParticipants(slug);
          setParticipants(Array.isArray(participantsData) ? participantsData : []);
        } catch (e) {
          console.error('Failed to load participants:', e);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setError(err.message || 'Failed to load event');
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

  if (error || !event) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {error || "Event not found"}
            </Typography>
            <Typography variant="small" className="text-blue-gray-600 mb-4">
              We couldn't locate that event. It may have been cancelled or removed.
            </Typography>
            <Link href="/dashboard/events">
              <Button variant="outlined">Back to Events</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const getStatusColor = (e) => {
    if (e.cancelled_at) return "red";
    const eventDate = new Date(e.date);
    const now = new Date();
    if (eventDate > now) return "blue";
    if (eventDate.toDateString() === now.toDateString()) return "green";
    return "gray";
  };

  const getStatus = (e) => {
    if (e.cancelled_at) return "cancelled";
    const eventDate = new Date(e.date);
    const now = new Date();
    if (eventDate > now) return "upcoming";
    if (eventDate.toDateString() === now.toDateString()) return "today";
    return "completed";
  };

  const venuePhoto = getVenuePhotoUrl(event.venue);
  const hostAvatar = getUserAvatarUrl(event.creator);

  return (
    <div className="mt-8">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/dashboard/events">
          <Button variant="text" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
          {venuePhoto && (
            <img
              src={venuePhoto}
              alt={event.venue?.name || 'Venue'}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Chip
                  value={event.sport || "Sport"}
                  className="bg-white/20 text-white"
                />
                <Chip
                  value={event.event_type || "Event"}
                  className="bg-white/20 text-white"
                />
                <Chip
                  value={getStatus(event)}
                  color={getStatusColor(event)}
                  className="capitalize"
                />
              </div>
              <Typography variant="small" className="opacity-80">
                ID: {event.id}
              </Typography>
            </div>
            <div>
              <Typography variant="h3" className="mb-2">
                {event.name}
              </Typography>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'No date'}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {event.start_time || '00:00'} - {event.end_time || '00:00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardBody className="p-6">
          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Venue */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <Typography variant="small" className="font-medium">Venue</Typography>
              </div>
              <Typography variant="h6" color="blue-gray">
                {event.venue?.name || 'No venue'}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                {event.venue?.address || 'No address'}
              </Typography>
            </div>

            {/* Slots */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <UserGroupIcon className="h-5 w-5" />
                <Typography variant="small" className="font-medium">Slots</Typography>
              </div>
              <Typography variant="h6" color="blue-gray">
                {participants.length} / {event.slots || 0}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                participants
              </Typography>
            </div>

            {/* Host */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Typography variant="small" className="font-medium text-gray-600 mb-2">Host</Typography>
              <div className="flex items-center gap-3">
                <Avatar
                  src={hostAvatar}
                  alt={event.creator?.username || 'Host'}
                  size="sm"
                />
                <div>
                  <Typography variant="small" className="font-medium text-blue-gray-800">
                    {event.creator?.first_name} {event.creator?.last_name}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    @{event.creator?.username || event.creator?.email?.split('@')[0]}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Created */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Typography variant="small" className="font-medium text-gray-600 mb-2">Created</Typography>
              <Typography variant="h6" color="blue-gray">
                {event.created_at ? new Date(event.created_at).toLocaleDateString() : 'Unknown'}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                {event.is_approved ? 'Approved' : 'Pending approval'}
              </Typography>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-8">
              <Typography variant="h6" color="blue-gray" className="mb-2">Description</Typography>
              <Typography className="text-gray-600">
                {event.description}
              </Typography>
            </div>
          )}

          {/* Participants List */}
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Participants ({participants.length})
            </Typography>
            {participants.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Typography variant="small" className="text-gray-600">
                  No participants yet
                </Typography>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar
                      src={getUserAvatarUrl(p.user)}
                      alt={p.user?.username || 'User'}
                      size="sm"
                    />
                    <div className="flex-1">
                      <Typography variant="small" className="font-medium text-blue-gray-800">
                        {p.user?.first_name} {p.user?.last_name}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        @{p.user?.username || 'unknown'}
                      </Typography>
                    </div>
                    <Chip
                      size="sm"
                      variant="ghost"
                      color={p.status === 'confirmed' ? 'green' : 'amber'}
                      value={p.status || 'pending'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default EventDetail;

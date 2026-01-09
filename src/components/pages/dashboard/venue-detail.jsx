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
} from "@/components/ui";
import Link from "next/link";
import { getAdminVenue } from "@/services/adminVenueService";
import { getVenuePhotoUrl, getUserAvatarUrl } from "@/lib/imageUrl";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export function VenueDetail({ params }) {
  // Unwrap the params Promise using React.use() for Next.js 16
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams || {};
  const [venue, setVenue] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadVenue = async () => {
      try {
        setLoading(true);
        setError("");
        // slug is the venue ID for admin routes
        const data = await getAdminVenue(slug);
        setVenue(data.venue || data);
      } catch (err) {
        console.error('Failed to load venue:', err);
        setError(err.message || 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadVenue();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6 text-center">
            <Typography variant="h6" color="blue-gray">Loading venue...</Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {error || "Venue not found"}
            </Typography>
            <Typography variant="small" className="text-blue-gray-600 mb-4">
              We couldn't locate that venue. It may have been removed.
            </Typography>
            <Link href="/dashboard/venues">
              <Button variant="outlined">Back to Venues</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const venuePhoto = getVenuePhotoUrl(venue);
  const ownerAvatar = getUserAvatarUrl(venue.owner || venue.user);

  return (
    <div className="mt-8">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/dashboard/venues">
          <Button variant="text" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Venues
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900">
        {venuePhoto && (
          <img
            src={venuePhoto}
            alt={venue.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white pb-8">
          <Typography variant="h3" className="mb-2">{venue.name}</Typography>
          <div className="flex items-center gap-2">
            <Typography variant="small" className="opacity-90">{venue.address}</Typography>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="mx-3 -mt-12 mb-6 lg:mx-4 border border-blue-gray-50">
        <CardBody className="p-6">
          {/* Header with Actions */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {venue.sport_type && <Chip value={venue.sport_type} size="sm" variant="ghost" className="rounded-full" />}
                {venue.surface && <Chip value={venue.surface} size="sm" variant="ghost" className="rounded-full" />}
                {venue.is_indoor && <Chip value="Indoor" size="sm" variant="ghost" className="rounded-full" />}
                {!venue.is_indoor && venue.is_covered && <Chip value="Covered" size="sm" variant="ghost" className="rounded-full" />}
                <Chip 
                  value={venue.verified_at ? 'verified' : 'pending'} 
                  size="sm" 
                  color={venue.verified_at ? 'green' : 'amber'} 
                  className="rounded-full capitalize" 
                />
                {venue.verified_by_ai !== undefined && (
                  <Chip 
                    size="sm"
                    value={venue.verified_by_ai ? 'AI Verified' : 'Manual'} 
                    color={venue.verified_by_ai ? 'blue' : 'gray'} 
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outlined" size="sm">Edit Venue</Button>
              <Button variant="filled" color="green" size="sm">Verify Venue</Button>
              <Button variant="outlined" color="red" size="sm">Delete</Button>
              <Link href="/dashboard/venues">
                <Button variant="text" size="sm">Back to Venues</Button>
              </Link>
            </div>
          </div>

          {/* Owner Information */}
          {(venue.owner || venue.user) && (
            <div className="mb-8 p-4 bg-blue-gray-50 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">Owner Information</Typography>
              <div className="flex items-center gap-4">
                <Avatar src={ownerAvatar} alt={venue.owner?.full_name || venue.user?.username || 'Owner'} size="md" />
                <div>
                  <Typography variant="small" className="font-semibold">
                    {venue.owner?.full_name || `${venue.user?.first_name || ''} ${venue.user?.last_name || ''}`.trim() || venue.user?.username}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    @{venue.owner?.username || venue.user?.username || 'N/A'}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    {venue.owner?.email || venue.user?.email || 'N/A'}
                  </Typography>
                  {(venue.owner?.phone || venue.user?.phone) && (
                    <Typography variant="small" className="text-blue-gray-600">
                      {venue.owner?.phone || venue.user?.phone}
                    </Typography>
                  )}
                </div>
                <div className="ml-auto">
                  <Button variant="outlined" size="sm">Contact Owner</Button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-blue-gray-100">
              <CardBody className="p-4 text-center">
                <Typography variant="h4" color="blue-gray">{venue.eventsHosted?.total || 0}</Typography>
                <Typography variant="small" className="text-blue-gray-600">Total Events</Typography>
              </CardBody>
            </Card>
            <Card className="border border-blue-gray-100">
              <CardBody className="p-4 text-center">
                <Typography variant="h4" color="green">₱{(venue.revenue?.total || 0).toLocaleString()}</Typography>
                <Typography variant="small" className="text-blue-gray-600">Total Revenue</Typography>
              </CardBody>
            </Card>
            <Card className="border border-blue-gray-100">
              <CardBody className="p-4 text-center">
                <Typography variant="h4" color="blue-gray">{venue.reviews?.averageRating || 0}</Typography>
                <Typography variant="small" className="text-blue-gray-600">Average Rating</Typography>
              </CardBody>
            </Card>
            <Card className="border border-blue-gray-100">
              <CardBody className="p-4 text-center">
                <Typography variant="h4" color="blue-gray">{venue.facilities?.length || 0}</Typography>
                <Typography variant="small" className="text-blue-gray-600">Facilities</Typography>
              </CardBody>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Left Column */}
            <div className="space-y-8">
              
              {/* Venue Information */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Venue Information</Typography>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Address:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.address}</Typography>
                  </div>
                  {(venue.city || venue.province) && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">City/Province:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">
                        {[venue.city, venue.province].filter(Boolean).join(', ') || '—'}
                      </Typography>
                    </div>
                  )}
                  {venue.region && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Region:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">{venue.region}</Typography>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Player Capacity:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.player_capacity || venue.playerCapacity || 0}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Spectator Capacity:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.spectator_capacity || venue.spectatorCapacity || 0}</Typography>
                  </div>
                  {venue.open_hours && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Open Hours:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">{venue.open_hours || venue.openHours || '—'}</Typography>
                    </div>
                  )}
                  {venue.created_at && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Created:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">
                        {new Date(venue.created_at || venue.createdDate).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Verification Status</Typography>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="font-medium">Status:</Typography>
                    <Chip 
                      value={venue.verified_at ? 'verified' : 'pending'} 
                      color={venue.verified_at ? 'green' : 'amber'} 
                      className="capitalize" 
                    />
                  </div>
                  {venue.verified_at && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Verified Date:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">
                        {new Date(venue.verified_at).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                  {venue.verification_expires_at && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Expiry Date:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">
                        {new Date(venue.verification_expires_at).toLocaleDateString()}
                      </Typography>
                    </div>
                  )}
                  {venue.verified_by_ai !== undefined && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Verification Source:</Typography>
                      <Chip 
                        size="sm"
                        value={venue.verified_by_ai ? 'AI Verified' : 'Manually Verified'} 
                        color={venue.verified_by_ai ? 'blue' : 'gray'} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {(venue.amenities && venue.amenities.length > 0) && (
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">Amenities</Typography>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <Chip key={index} value={amenity} size="sm" variant="ghost" className="rounded-full" />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Map */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Location</Typography>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-blue-gray-100">
                  <div className="text-center">
                    <Typography variant="small" className="text-blue-gray-600 mb-2">Interactive Map</Typography>
                    {(venue.coordinates?.lat || venue.latitude) && (
                      <Typography variant="small" className="text-blue-gray-500">
                        Lat: {venue.coordinates?.lat || venue.latitude}, Lng: {venue.coordinates?.lng || venue.longitude}
                      </Typography>
                    )}
                    {venue.map_url && (
                      <div className="mt-2">
                        <a href={venue.map_url || venue.mapUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                          Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Summary */}
              {(venue.average_rating || venue.rating) && (
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">Reviews & Ratings</Typography>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Typography variant="h3" color="blue-gray">{venue.average_rating || venue.rating || 0}</Typography>
                      <div>
                        <Typography variant="small" className="text-blue-gray-600">
                          {venue.total_reviews || venue.reviews?.totalReviews || 0} reviews
                        </Typography>
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <svg key={star} className={`h-4 w-4 ${star <= (venue.average_rating || venue.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Facilities Section */}
          {venue.facilities && venue.facilities.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" color="blue-gray">Facilities</Typography>
                <Button variant="outlined" size="sm">Add Facility</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-gray-100">
                      <th className="text-left py-3 px-4">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">Facility</Typography>
                      </th>
                      <th className="text-left py-3 px-4">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">Type</Typography>
                      </th>
                      <th className="text-left py-3 px-4">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">Price/Hour</Typography>
                      </th>
                      <th className="text-left py-3 px-4">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">Bookings</Typography>
                      </th>
                      <th className="text-left py-3 px-4">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">Actions</Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {venue.facilities.map((facility, index) => (
                      <tr key={facility.id || index} className="border-b border-blue-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <Typography variant="small" className="font-semibold">{facility.name}</Typography>
                            {facility.description && (
                              <Typography variant="small" className="text-blue-gray-600">{facility.description}</Typography>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small">{facility.type || facility.facility_type || 'N/A'}</Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small" className="font-semibold">
                            ₱{(facility.price_per_hour || facility.pricePerHour || 0).toLocaleString()}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small">{facility.total_bookings || facility.totalBookings || 0}</Typography>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <IconButton variant="text" size="sm" color="blue">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </IconButton>
                            <IconButton variant="text" size="sm" color="red">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gallery */}
          {venue.photos && venue.photos.length > 0 && (
            <div className="mt-8">
              <Typography variant="h6" color="blue-gray" className="mb-4">Gallery</Typography>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {venue.photos.map((photo, i) => {
                  const photoUrl = photo.image_path || photo.path || photo.url || photo;
                  const fullUrl = photoUrl && (photoUrl.startsWith('http') ? photoUrl : getVenuePhotoUrl({ photos: [photo] }));
                  return (
                    <div key={i} className="overflow-hidden rounded-lg border border-blue-gray-100 aspect-square">
                      <img 
                        src={fullUrl} 
                        alt={`gallery-${i}`} 
                        className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </CardBody>
      </Card>
    </div>
  );
}

export default VenueDetail;

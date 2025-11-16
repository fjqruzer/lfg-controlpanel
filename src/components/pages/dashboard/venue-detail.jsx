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

export function VenueDetail({ params }) {
  // Unwrap the params Promise using React.use() for Next.js 16
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams || {};
  const [venue, setVenue] = React.useState(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("lfg.venues");
      if (raw) {
        const list = JSON.parse(raw);
        const found = Array.isArray(list) ? list.find((v) => v.slug === slug) : null;
        setVenue(found || null);
      }
    } catch {
      setVenue(null);
    }
  }, [slug]);

  if (!venue) {
    return (
      <div className="mt-12">
        <Card className="border border-blue-gray-50">
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">Venue not found</Typography>
            <Typography variant="small" className="text-blue-gray-600 mb-4">We couldn't locate that venue. It may have been removed.</Typography>
            <Link href="/dashboard/venues">
              <Button variant="outlined">Back to Venues</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `url('${venue.img}')` }}>
        <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
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
                {venue.sportType && <Chip value={venue.sportType} size="sm" variant="ghost" className="rounded-full" />}
                {venue.surface && <Chip value={venue.surface} size="sm" variant="ghost" className="rounded-full" />}
                {venue.indoor && <Chip value="Indoor" size="sm" variant="ghost" className="rounded-full" />}
                {!venue.indoor && venue.covered && <Chip value="Covered" size="sm" variant="ghost" className="rounded-full" />}
                <Chip 
                  value={venue.verification?.status || 'unverified'} 
                  size="sm" 
                  color={
                    venue.verification?.status === 'verified' ? 'green' : 
                    venue.verification?.status === 'pending' ? 'amber' : 
                    venue.verification?.status === 'expired' ? 'red' : 'gray'
                  } 
                  className="rounded-full capitalize" 
                />
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
          <div className="mb-8 p-4 bg-blue-gray-50 rounded-lg">
            <Typography variant="h6" color="blue-gray" className="mb-3">Owner Information</Typography>
            <div className="flex items-center gap-4">
              <Avatar src={`https://i.pravatar.cc/80?u=${venue.owner?.email}`} alt={venue.owner?.fullName} size="md" />
              <div>
                <Typography variant="small" className="font-semibold">{venue.owner?.fullName}</Typography>
                <Typography variant="small" className="text-blue-gray-600">@{venue.owner?.username}</Typography>
                <Typography variant="small" className="text-blue-gray-600">{venue.owner?.email}</Typography>
                <Typography variant="small" className="text-blue-gray-600">{venue.owner?.phone}</Typography>
              </div>
              <div className="ml-auto">
                <Button variant="outlined" size="sm">Contact Owner</Button>
              </div>
            </div>
          </div>

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
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">City/Province:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.city}, {venue.province}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Region:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.region}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Player Capacity:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.playerCapacity || 0}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Spectator Capacity:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.spectatorCapacity || 0}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Open Hours:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{venue.openHours || '—'}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="font-medium">Created:</Typography>
                    <Typography variant="small" className="text-blue-gray-600">{new Date(venue.createdDate).toLocaleDateString()}</Typography>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Verification Status</Typography>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="font-medium">Status:</Typography>
                    <Chip 
                      value={venue.verification?.status || 'unverified'} 
                      color={
                        venue.verification?.status === 'verified' ? 'green' : 
                        venue.verification?.status === 'pending' ? 'amber' : 
                        venue.verification?.status === 'expired' ? 'red' : 'gray'
                      } 
                      className="capitalize" 
                    />
                  </div>
                  {venue.verification?.verifiedDate && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Verified Date:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">{new Date(venue.verification.verifiedDate).toLocaleDateString()}</Typography>
                    </div>
                  )}
                  {venue.verification?.expiryDate && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Expiry Date:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">{new Date(venue.verification.expiryDate).toLocaleDateString()}</Typography>
                    </div>
                  )}
                  {venue.verification?.verifiedBy && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="font-medium">Verified By:</Typography>
                      <Typography variant="small" className="text-blue-gray-600">{venue.verification.verifiedBy}</Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Amenities</Typography>
                {venue.amenities && venue.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity) => (
                      <Chip key={amenity} value={amenity} size="sm" variant="ghost" className="rounded-full" />
                    ))}
                  </div>
                ) : (
                  <Typography variant="small" className="text-blue-gray-600">No amenities listed</Typography>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Map */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Location</Typography>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-blue-gray-100">
                  <div className="text-center">
                    <Typography variant="small" className="text-blue-gray-600 mb-2">Interactive Map</Typography>
                    <Typography variant="small" className="text-blue-gray-500">Lat: {venue.coordinates?.lat}, Lng: {venue.coordinates?.lng}</Typography>
                    {venue.mapUrl && (
                      <div className="mt-2">
                        <a href={venue.mapUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                          Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Summary */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">Reviews & Ratings</Typography>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Typography variant="h3" color="blue-gray">{venue.reviews?.averageRating || 0}</Typography>
                    <div>
                      <Typography variant="small" className="text-blue-gray-600">{venue.reviews?.totalReviews || 0} reviews</Typography>
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <svg key={star} className={`h-4 w-4 ${star <= (venue.reviews?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  {venue.reviews?.ratings && (
                    <div className="space-y-1">
                      {[5,4,3,2,1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <Typography variant="small" className="w-4">{rating}</Typography>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${((venue.reviews.ratings[rating] || 0) / (venue.reviews.totalReviews || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <Typography variant="small" className="w-8 text-right">{venue.reviews.ratings[rating] || 0}</Typography>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Facilities Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" color="blue-gray">Facilities</Typography>
              <Button variant="outlined" size="sm">Add Facility</Button>
            </div>
            {venue.facilities && venue.facilities.length > 0 ? (
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
                    {venue.facilities.map((facility) => (
                      <tr key={facility.id} className="border-b border-blue-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <Typography variant="small" className="font-semibold">{facility.name}</Typography>
                            <Typography variant="small" className="text-blue-gray-600">{facility.description}</Typography>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small">{facility.type}</Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small" className="font-semibold">₱{facility.pricePerHour.toLocaleString()}</Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small">{facility.totalBookings}</Typography>
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
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Typography variant="small" className="text-blue-gray-600">No facilities added yet</Typography>
              </div>
            )}
          </div>

          {/* Events Hosted Section */}
          <div className="mt-8">
            <Typography variant="h6" color="blue-gray" className="mb-4">Events Hosted</Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="border border-blue-gray-100">
                <CardBody className="p-4 text-center">
                  <Typography variant="h5" color="blue-gray">{venue.eventsHosted?.upcoming || 0}</Typography>
                  <Typography variant="small" className="text-blue-gray-600">Upcoming Events</Typography>
                </CardBody>
              </Card>
              <Card className="border border-blue-gray-100">
                <CardBody className="p-4 text-center">
                  <Typography variant="h5" color="blue-gray">{venue.eventsHosted?.past || 0}</Typography>
                  <Typography variant="small" className="text-blue-gray-600">Past Events</Typography>
                </CardBody>
              </Card>
              <Card className="border border-blue-gray-100">
                <CardBody className="p-4 text-center">
                  <Typography variant="h5" color="blue-gray">{venue.eventsHosted?.thisMonth || 0}</Typography>
                  <Typography variant="small" className="text-blue-gray-600">This Month</Typography>
                </CardBody>
              </Card>
            </div>
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600">Event list will be displayed here</Typography>
              <Button variant="outlined" size="sm" className="mt-2">View All Events</Button>
            </div>
          </div>

          {/* Gallery */}
          {venue.images && venue.images.length > 0 && (
            <div className="mt-8">
              <Typography variant="h6" color="blue-gray" className="mb-4">Gallery</Typography>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {venue.images.map((src, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-blue-gray-100 aspect-square">
                    <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardBody>
      </Card>
    </>
  );
}

export default VenueDetail;

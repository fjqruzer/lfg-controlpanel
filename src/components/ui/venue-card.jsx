import Link from "next/link";
import { Typography, Button, Chip, Tooltip, IconButton } from "./";
import { MapPinIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

export function VenueCard({ venue }) {
  const v = venue;
  
  return (
    <div className="group">
      <div className="relative h-48 overflow-hidden rounded-xl mb-4">
        <img src={v.img} alt={v.name} className="h-full w-full object-cover" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Chip 
            variant="gradient" 
            color={v.status === 'Active' ? 'green' : 'blue-gray'} 
            value={v.status} 
            className="py-1 px-2.5 text-[11px] font-medium"
          />
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Typography variant="small" className="font-medium text-blue-gray-500 uppercase text-xs">
              {v.region || "Venue"}
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {v.name}
            </Typography>
          </div>
          <Tooltip content={
            <div className="w-64 p-2">
              <Typography variant="small" className="font-medium text-white mb-2">Additional Details</Typography>
              <div className="flex flex-wrap gap-1 mb-3">
                {v.sportType && (
                  <Chip value={v.sportType} size="sm" variant="filled" color="gray" className="rounded-full text-[10px]" />
                )}
                {v.surface && (
                  <Chip value={v.surface} size="sm" variant="filled" color="gray" className="rounded-full text-[10px]" />
                )}
                <Chip 
                  value={v.indoor ? 'Indoor' : (v.covered ? 'Covered' : 'Outdoor')} 
                  size="sm" 
                  variant="filled" 
                  color="gray" 
                  className="rounded-full text-[10px]" 
                />
              </div>
              <div className="space-y-1">
                {v.playerCapacity && (
                  <Typography variant="small" className="text-white text-xs">
                    <span className="font-medium">Player Capacity:</span> {v.playerCapacity}
                  </Typography>
                )}
                {v.spectatorCapacity && (
                  <Typography variant="small" className="text-white text-xs">
                    <span className="font-medium">Spectator Capacity:</span> {v.spectatorCapacity}
                  </Typography>
                )}
                {v.amenities && v.amenities.length > 0 && (
                  <Typography variant="small" className="text-white text-xs">
                    <span className="font-medium">Amenities:</span> {v.amenities.join(', ')}
                  </Typography>
                )}
              </div>
            </div>
          }>
            <IconButton variant="text" size="sm" className="text-blue-gray-500 hover:text-blue-gray-900">
              <InformationCircleIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant="small" className="font-normal text-blue-gray-500 line-clamp-1 mb-3">
          <MapPinIcon className="h-3.5 w-3.5 inline mr-1" />
          {v.address}
        </Typography>
        <div className="flex items-center gap-2 mb-3">
          {v.sportType && (
            <Typography variant="small" className="font-medium text-blue-gray-700 text-xs">
              {v.sportType}
            </Typography>
          )}
          <Typography variant="small" className="font-normal text-blue-gray-500 text-xs">
            •
          </Typography>
          <Typography variant="small" className="font-medium text-blue-gray-700 text-xs">
            {v.indoor ? 'Indoor' : (v.covered ? 'Covered' : 'Outdoor')}
          </Typography>
          {v.surface && (
            <>
              <Typography variant="small" className="font-normal text-blue-gray-500 text-xs">
                •
              </Typography>
              <Typography variant="small" className="font-medium text-blue-gray-700 text-xs">
                {v.surface}
              </Typography>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="small" className="font-medium text-blue-gray-900 text-sm">
            Capacity: {v.capacity || v.playerCapacity || 0}
          </Typography>
          <Chip 
            variant="filled" 
            color={v.bookingStatus === 'Available' ? 'green' : 'gray'} 
            value={v.bookingStatus || 'Available'} 
            className="py-1 px-2.5 text-[10px] font-medium"
          />
        </div>
        <Link href={`/dashboard/venues/${v.slug || v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="block">
          <Button 
            variant="outlined" 
            size="sm" 
            color="dark"
            className="w-full border-black text-black hover:bg-black hover:text-white transition-colors"
          >
            View Venue
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default VenueCard;
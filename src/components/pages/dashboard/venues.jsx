import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  IconButton,
  Input,
  Chip,
  Checkbox,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Textarea,
} from "@/components/ui";
import { 
  MapPinIcon, 
  TableCellsIcon, 
  ListBulletIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useNotifications } from "@/context/notifications";
import {
  getAdminVenues,
  getAdminVenue,
  updateAdminVenue,
  approveAdminVenue,
  rejectAdminVenue,
} from "@/services/adminVenueService";
import { exportVenues } from "@/services/adminExportService";
import { getVenuePhotoUrl } from "@/lib/imageUrl";

const statuses = ["All", "active", "closed"];

export function Venues() {
  const { notify } = useNotifications();
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Dialog states
  const [editOpen, setEditOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load venues from admin service
    const loadVenues = async () => {
      try {
        setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        page,
        per_page: perPage,
      };
      const res = await getAdminVenues(params);
      // Laravel paginate() returns { current_page, data, from, last_page, ... total }
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setVenues(list);
      // Set pagination from Laravel's paginate response
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
        from: res.from,
        to: res.to,
      });
    } catch (err) {
      console.error('Failed to load venues:', err);
      setError(err.message || 'Failed to load venues');
        notify('Failed to load venues', { color: 'red', icon: true });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadVenues();
  };

  const handleSelectAll = () => {
    if (selectedVenues.length === venues.length) {
      setSelectedVenues([]);
    } else {
      setSelectedVenues(venues.map(v => v.id));
    }
  };

  const handleSelectVenue = (venueId) => {
    if (selectedVenues.includes(venueId)) {
      setSelectedVenues(selectedVenues.filter(id => id !== venueId));
    } else {
      setSelectedVenues([...selectedVenues, venueId]);
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

  const handleApproveClick = (venue) => {
    setCurrent(venue);
    setApproveOpen(true);
  };

  const handleRejectClick = (venue) => {
    setCurrent(venue);
    setRejectReason("");
    setRejectOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!current) return;
    try {
      setActionLoading(true);
      await approveAdminVenue(current.id);
      notify('Venue approved successfully', { color: 'green' });
      setApproveOpen(false);
      setCurrent(null);
      loadVenues();
    } catch (err) {
      notify(err.message || 'Failed to approve venue', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!current) return;
    try {
      setActionLoading(true);
      await rejectAdminVenue(current.id, rejectReason);
      notify('Venue rejected', { color: 'green' });
      setRejectOpen(false);
      setCurrent(null);
      setRejectReason("");
      loadVenues();
    } catch (err) {
      notify(err.message || 'Failed to reject venue', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = async (venue) => {
    try {
      // Fetch full venue details
      const fullVenue = await getAdminVenue(venue.id);
      setCurrent(fullVenue);
      setEditOpen(true);
    } catch (err) {
      notify(err.message || 'Failed to load venue details', { color: 'red' });
    }
  };

  const handleEditSave = async () => {
    if (!current) return;
    try {
      setActionLoading(true);
      await updateAdminVenue(current.id, {
        name: current.name,
        address: current.address,
        is_closed: current.is_closed,
      });
      notify('Venue updated successfully', { color: 'green' });
      setEditOpen(false);
      setCurrent(null);
      loadVenues();
    } catch (err) {
      notify(err.message || 'Failed to update venue', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportVenues();
      notify('Export started', { color: 'green' });
    } catch (err) {
      notify(err.message || 'Export failed', { color: 'red' });
    }
  };

  const getVerificationStatus = (venue) => {
    if (venue.verified_at && venue.verification_expires_at) {
      const expiresAt = new Date(venue.verification_expires_at);
      if (expiresAt > new Date()) {
        return 'verified';
      }
      return 'expired';
    }
    return 'pending';
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'green';
      case 'pending': return 'amber';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/lfg-black.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/10">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="h6" color="white">
                  Venue Management
                </Typography>
                <Typography variant="small" className="text-white/80">
                  Monitor and manage venue verification
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <form onSubmit={handleSearch} className="w-full md:w-72">
                <Input 
                  label="Search venues" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </form>
              <Button 
                variant="text" 
                color="white"
                className="hidden md:flex"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e); setPage(1); }}
              >
                {statuses.map(status => (
                  <Option key={status} value={status}>
                    {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedVenues.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <Typography variant="small" color="white">
                {selectedVenues.length} venue(s) selected
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
              </div>
            </div>
          )}
        </CardHeader>

        <CardBody className="p-4">
          {error && (
            <Typography variant="small" className="text-red-500 mb-4 font-medium">
              {error}
                  </Typography>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6" color="blue-gray">
              Venues ({venues.length})
                  </Typography>
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 relative">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                      viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <TableCellsIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setViewMode('list')}
                    className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                      viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </IconButton>
                  <div 
                    className={`absolute top-1 h-8 w-8 bg-black rounded-md transition-all duration-300 ease-in-out ${
                      viewMode === 'grid' ? 'left-1' : 'left-9'
                    }`}
                  />
                </div>
              </div>

          {loading ? (
            <div className="text-center py-8">
              <Typography className="text-blue-gray-400">Loading venues...</Typography>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {venues.map((v) => {
                const verificationStatus = getVerificationStatus(v);
                return (
                  <Card key={v.id} className="border border-blue-gray-100">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <Avatar 
                          src={getVenuePhotoUrl(v)} 
                          alt={v.name} 
                          size="lg" 
                          variant="rounded" 
                        />
                        <div className="flex-1 min-w-0">
                          <Typography variant="h6" color="blue-gray" className="truncate">
                            {v.name}
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-500 truncate">
                            {v.address}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <Chip 
                          variant="filled" 
                          color={getVerificationColor(verificationStatus)}
                          value={verificationStatus} 
                          className="py-0.5 px-2 text-[10px] font-medium capitalize" 
                        />
                        <Chip 
                          variant="ghost" 
                          color={v.is_closed ? 'red' : 'green'}
                          value={v.is_closed ? 'Closed' : 'Active'} 
                          className="py-0.5 px-2 text-[10px] font-medium" 
                        />
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        {verificationStatus === 'pending' && (
                          <>
                            <IconButton 
                              variant="text" 
                              size="sm" 
                              color="green"
                              onClick={() => handleApproveClick(v)}
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton 
                              variant="text" 
                              size="sm" 
                              color="red"
                              onClick={() => handleRejectClick(v)}
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </IconButton>
                          </>
                        )}
                        <Link href={`/dashboard/venues/${v.id}`}>
                          <IconButton variant="text" size="sm" color="blue">
                            <EyeIcon className="h-5 w-5" />
                          </IconButton>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
                </div>
              ) : (
            <div className="overflow-x-scroll">
              <table className="w-full min-w-[1000px] table-auto">
                      <thead>
                        <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Checkbox
                        checked={selectedVenues.length === venues.length && venues.length > 0}
                        onChange={handleSelectAll}
                        color="gray"
                      />
                    </th>
                    {[
                      { key: "name", label: "venue" },
                      { key: "address", label: "location" },
                      { key: "status", label: "status" },
                      { key: "verification", label: "verification" },
                      { key: "created_at", label: "created" },
                      { key: "actions", label: "" }
                    ].map((col) => (
                      <th key={col.key} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <button
                          onClick={() => col.key !== "actions" && handleSort(col.key)}
                          className="flex items-center gap-1 font-semibold text-blue-gray-400 hover:text-blue-gray-600"
                        >
                          <Typography variant="small" className="text-[11px] font-bold uppercase">
                            {col.label}
                          </Typography>
                          {col.key !== "actions" && (
                            <ChevronUpDownIcon className="h-4 w-4" />
                          )}
                        </button>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                  {venues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-5 text-center text-blue-gray-400">
                        No venues found.
                      </td>
                    </tr>
                  ) : (
                    venues.map((v, idx) => {
                      const verificationStatus = getVerificationStatus(v);
                      const className = `py-3 px-5 ${idx !== venues.length - 1 ? 'border-b border-blue-gray-50' : ''}`;
                          return (
                            <tr key={v.id}>
                          <td className={className}>
                            <Checkbox
                              checked={selectedVenues.includes(v.id)}
                              onChange={() => handleSelectVenue(v.id)}
                              color="gray"
                            />
                          </td>
                              <td className={className}>
                                <div className="flex items-center gap-4">
                              <Avatar 
                                src={getVenuePhotoUrl(v)} 
                                alt={v.name} 
                                size="sm" 
                                variant="rounded" 
                              />
                                  <div>
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  {v.name}
                                </Typography>
                                <Typography className="text-xs text-blue-gray-500">
                                  ID: {v.id}
                                </Typography>
                                  </div>
                                </div>
                              </td>
                              <td className={className}>
                                <div>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {v.address || '—'}
                              </Typography>
                              <Typography className="text-xs text-blue-gray-500">
                                {v.city || ''}{v.city && v.province ? ', ' : ''}{v.province || ''}
                              </Typography>
                                </div>
                              </td>
                              <td className={className}>
                            <Chip 
                              variant="ghost" 
                              color={v.is_closed ? 'red' : 'green'}
                              value={v.is_closed ? 'Closed' : 'Active'} 
                              className="py-0.5 px-2 text-[10px] font-medium w-fit" 
                            />
                              </td>
                              <td className={className}>
                                <Chip 
                                  variant="filled" 
                              color={getVerificationColor(verificationStatus)}
                              value={verificationStatus} 
                                  className="py-0.5 px-2 text-[10px] font-medium w-fit capitalize" 
                                />
                              </td>
                              <td className={className}>
                            <Typography className="text-xs font-normal text-blue-gray-600">
                              {v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}
                            </Typography>
                              </td>
                              <td className={className}>
                                <div className="flex items-center gap-1">
                              {verificationStatus === 'pending' && (
                                <>
                                  <IconButton 
                                    variant="text" 
                                    size="sm" 
                                    color="green"
                                    onClick={() => handleApproveClick(v)}
                                    title="Approve venue"
                                  >
                                    <CheckCircleIcon className="h-5 w-5" />
                                  </IconButton>
                                  <IconButton 
                                    variant="text" 
                                    size="sm" 
                                    color="red"
                                    onClick={() => handleRejectClick(v)}
                                    title="Reject venue"
                                  >
                                    <XCircleIcon className="h-5 w-5" />
                                  </IconButton>
                                </>
                              )}
                              <Menu placement="left-start">
                                <MenuHandler>
                                  <IconButton variant="text" size="sm" color="blue-gray">
                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                    </IconButton>
                                </MenuHandler>
                                <MenuList>
                                  <Link href={`/dashboard/venues/${v.id}`}>
                                    <MenuItem>
                                      <EyeIcon className="h-4 w-4 mr-2 inline" />
                                      View Details
                                    </MenuItem>
                                  </Link>
                                  <MenuItem onClick={() => handleEditClick(v)}>
                                    <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Venue
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                                </div>
                              </td>
                            </tr>
                          );
                    })
                  )}
                      </tbody>
                    </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <Typography variant="small" className="text-blue-gray-600">
                Page {pagination.current_page || page} of {pagination.last_page || 1} • Total {pagination.total || venues.length} venues
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
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} handler={() => setEditOpen(false)} size="sm">
        <DialogHeader>Edit Venue</DialogHeader>
        <DialogBody divider>
          {current && (
            <div className="flex flex-col gap-4">
              <Input 
                label="Venue name" 
                value={current.name || ''} 
                onChange={(e) => setCurrent((c) => ({ ...c, name: e.target.value }))} 
              />
              <Input 
                label="Address" 
                value={current.address || ''} 
                onChange={(e) => setCurrent((c) => ({ ...c, address: e.target.value }))} 
              />
              <div className="flex items-center justify-between rounded-lg border border-blue-gray-100 p-3">
                <Typography variant="small">Closed</Typography>
                <input 
                  type="checkbox" 
                  checked={current.is_closed || false} 
                  onChange={() => setCurrent((c) => ({ ...c, is_closed: !c.is_closed }))} 
                  className="h-4 w-4"
                />
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)} className="mr-1" disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleEditSave} disabled={actionLoading}>
            {actionLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveOpen} handler={() => setApproveOpen(false)} size="sm">
        <DialogHeader>Approve Venue</DialogHeader>
        <DialogBody divider>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to approve <strong>{current?.name}</strong>? 
            This will verify the venue for 1 year.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setApproveOpen(false)} className="mr-1" disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleApproveConfirm} disabled={actionLoading}>
            {actionLoading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectOpen} handler={() => setRejectOpen(false)} size="sm">
        <DialogHeader>Reject Venue</DialogHeader>
        <DialogBody divider>
          <Typography variant="paragraph" color="blue-gray" className="mb-4">
            Are you sure you want to reject <strong>{current?.name}</strong>?
          </Typography>
          <Textarea
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setRejectOpen(false)} className="mr-1" disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="red" onClick={handleRejectConfirm} disabled={actionLoading}>
            {actionLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Venues;

import React, { useEffect, useState } from "react";
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
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  EyeIcon,
  DocumentTextIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminCoaches,
  getAdminCoach,
  approveCoach,
  rejectCoach,
  resetCoachVerification,
  getCoachDocuments,
  getCoachStatistics,
} from "@/services/adminCoachService";
import { useNotifications } from "@/context/notifications";
import Link from "next/link";
import { getUserAvatarUrl } from "@/lib/imageUrl";

const verificationStatuses = ["All", "verified", "pending"];
const aiVerifiedOptions = ["All", "true", "false"];

export function Coaches() {
  const { notify } = useNotifications();
  const [query, setQuery] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCoaches, setSelectedCoaches] = useState([]);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState("All");
  const [aiVerifiedFilter, setAiVerifiedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [coachToAction, setCoachToAction] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadCoaches = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        verification_status: verificationStatusFilter !== "All" ? verificationStatusFilter : undefined,
        ai_verified: aiVerifiedFilter !== "All" ? (aiVerifiedFilter === "true" ? true : false) : undefined,
        page,
        per_page: perPage,
      };
      const res = await getAdminCoaches(params);
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setCoaches(list);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
      });
    } catch (err) {
      setError(err.message || "Failed to load coaches");
      setCoaches([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const res = await getCoachStatistics();
      setStatistics(res.statistics || null);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  useEffect(() => {
    loadCoaches();
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, verificationStatusFilter, aiVerifiedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadCoaches();
  };

  const handleSelectAll = () => {
    if (selectedCoaches.length === coaches.length) {
      setSelectedCoaches([]);
    } else {
      setSelectedCoaches(coaches.map(c => c.id));
    }
  };

  const handleSelectCoach = (coachId) => {
    if (selectedCoaches.includes(coachId)) {
      setSelectedCoaches(selectedCoaches.filter(id => id !== coachId));
    } else {
      setSelectedCoaches([...selectedCoaches, coachId]);
    }
  };

  const handleApproveClick = (coach) => {
    setCoachToAction(coach);
    setVerificationNotes("");
    setShowApproveDialog(true);
  };

  const handleRejectClick = (coach) => {
    setCoachToAction(coach);
    setVerificationNotes("");
    setShowRejectDialog(true);
  };

  const handleResetClick = async (coach) => {
    if (!confirm(`Reset verification for ${coach.user?.username || coach.user?.email}?`)) return;
    try {
      setActionLoading(true);
      await resetCoachVerification(coach.id);
      notify('Coach verification reset successfully', { color: 'green' });
      loadCoaches();
    } catch (err) {
      notify(err.message || 'Failed to reset verification', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveConfirm = async () => {
    if (!coachToAction) return;
    try {
      setActionLoading(true);
      await approveCoach(coachToAction.id, verificationNotes);
      notify('Coach approved successfully', { color: 'green' });
      setShowApproveDialog(false);
      setCoachToAction(null);
      setVerificationNotes("");
      loadCoaches();
    } catch (err) {
      notify(err.message || 'Failed to approve coach', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!coachToAction || !verificationNotes.trim()) {
      notify('Verification notes are required', { color: 'amber' });
      return;
    }
    try {
      setActionLoading(true);
      await rejectCoach(coachToAction.id, verificationNotes);
      notify('Coach verification rejected', { color: 'green' });
      setShowRejectDialog(false);
      setCoachToAction(null);
      setVerificationNotes("");
      loadCoaches();
    } catch (err) {
      notify(err.message || 'Failed to reject coach', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const getVerificationStatus = (coach) => {
    return coach.is_verified && coach.verified_at ? "verified" : "pending";
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <UserIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Total Coaches</Typography>
                <Typography variant="h4" color="blue-gray">{statistics.total || 0}</Typography>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Verified</Typography>
                <Typography variant="h4" color="green">{statistics.verified || 0}</Typography>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-500/10 p-3">
                <ArrowPathIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Pending</Typography>
                <Typography variant="h4" color="amber">{statistics.pending || 0}</Typography>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <CheckCircleIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">AI Verified</Typography>
                <Typography variant="h4" color="purple">{statistics.verified_by_ai || 0}</Typography>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Coaches Card */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h6" color="white">
                Coach Verification
              </Typography>
              <Typography variant="small" className="text-white/90">
                Review and verify coach licenses
              </Typography>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <form onSubmit={handleSearch} className="w-full md:w-72">
                <Input 
                  label="Search coaches" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  labelProps={{ className: '!text-white' }}
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
                label="Verification Status"
                value={verificationStatusFilter}
                onChange={(e) => { setVerificationStatusFilter(e); setPage(1); }}
              >
                {verificationStatuses.map(status => (
                  <Option key={status} value={status}>
                    {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
              <Select 
                label="AI Verified"
                value={aiVerifiedFilter}
                onChange={(e) => { setAiVerifiedFilter(e); setPage(1); }}
              >
                {aiVerifiedOptions.map(opt => (
                  <Option key={opt} value={opt}>{opt === "All" ? "All" : opt === "true" ? "AI Verified" : "Manual"}</Option>
                ))}
              </Select>
            </div>
          )}
        </CardHeader>
        
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {error && (
            <Typography variant="small" className="text-red-500 px-6 pt-4 pb-2 font-medium">
              {error}
            </Typography>
          )}
          <table className="w-full min-w-[1000px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Checkbox
                    checked={selectedCoaches.length === coaches.length && coaches.length > 0}
                    onChange={handleSelectAll}
                    color="gray"
                  />
                </th>
                {[
                  { key: "coach", label: "coach" },
                  { key: "email", label: "email" },
                  { key: "years_experience", label: "experience" },
                  { key: "rating", label: "rating" },
                  { key: "verification_status", label: "status" },
                  { key: "created_at", label: "registered" },
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 px-5 text-center text-blue-gray-400">
                    Loading coaches...
                  </td>
                </tr>
              ) : coaches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 px-5 text-center text-blue-gray-400">
                    No coaches found.
                  </td>
                </tr>
              ) : (
                coaches.map((coach, idx) => {
                  const status = getVerificationStatus(coach);
                  const isPending = status === "pending";
                  const user = coach.user || {};
                  
                  return (
                    <tr key={coach.id}>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Checkbox
                          checked={selectedCoaches.includes(coach.id)}
                          onChange={() => handleSelectCoach(coach.id)}
                          color="gray"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={getUserAvatarUrl(user)}
                            alt={user.username || "Coach"}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {user.first_name} {user.last_name}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-400">
                              @{user.username || "—"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.email || "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {coach.years_experience || 0} years
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-1">
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {coach.rating?.toFixed(1) || "0.0"}
                          </Typography>
                          <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex flex-col gap-1">
                          <StatusChip status={status} type="document" />
                          {coach.verified_by_ai !== undefined && (
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={coach.verified_by_ai ? "AI" : "Manual"}
                              color={coach.verified_by_ai ? "blue" : "gray"}
                              className="py-0.5 px-2 text-[10px] w-fit"
                            />
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {coach.created_at ? new Date(coach.created_at).toLocaleDateString() : "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== coaches.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-1">
                          {isPending && (
                            <>
                              <IconButton 
                                variant="text" 
                                color="green"
                                onClick={() => handleApproveClick(coach)}
                                title="Approve coach"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </IconButton>
                              <IconButton 
                                variant="text" 
                                color="red"
                                onClick={() => handleRejectClick(coach)}
                                title="Reject coach"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </IconButton>
                            </>
                          )}
                          {!isPending && (
                            <IconButton 
                              variant="text" 
                              color="amber"
                              onClick={() => handleResetClick(coach)}
                              title="Reset verification"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </IconButton>
                          )}
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton variant="text" color="blue-gray">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <Link href={`/dashboard/coaches/${coach.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </MenuItem>
                              </Link>
                              <Link href={`/dashboard/documents?entity_type=coach&q=${coach.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <DocumentTextIcon className="h-4 w-4" />
                                  View Documents
                                </MenuItem>
                              </Link>
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
        </CardBody>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} handler={() => setShowApproveDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Approve Coach</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setShowApproveDialog(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Approve <strong>{coachToAction?.user?.username || coachToAction?.user?.email}</strong> as a verified coach?
          </Typography>
          <Textarea
            label="Verification Notes (Optional)"
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            rows={3}
            placeholder="Add any notes about this verification..."
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={() => setShowApproveDialog(false)} className="mr-1">
            Cancel
          </Button>
          <Button color="green" onClick={handleApproveConfirm} disabled={actionLoading}>
            {actionLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} handler={() => setShowRejectDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Reject Coach</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setShowRejectDialog(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Reject coach verification for <strong>{coachToAction?.user?.username || coachToAction?.user?.email}</strong>?
          </Typography>
          <Textarea
            label="Verification Notes (Required)"
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            rows={3}
            placeholder="Explain why the verification is being rejected..."
            required
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={() => setShowRejectDialog(false)} className="mr-1">
            Cancel
          </Button>
          <Button color="red" onClick={handleRejectConfirm} disabled={actionLoading || !verificationNotes.trim()}>
            {actionLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <Typography variant="small" className="text-blue-gray-600">
            Page {pagination.current_page} of {pagination.last_page} • Total {pagination.total} coaches
          </Typography>
          <div className="flex items-center gap-2">
            <Button variant="outlined" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <Button variant="outlined" size="sm" disabled={page >= pagination.last_page} onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coaches;

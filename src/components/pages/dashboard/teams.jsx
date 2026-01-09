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
  UserGroupIcon,
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
  getAdminTeams,
  getAdminTeam,
  approveTeam,
  rejectTeam,
  resetTeamVerification,
  getTeamDocuments,
  getTeamStatistics,
} from "@/services/adminTeamService";
import { useNotifications } from "@/context/notifications";
import Link from "next/link";
import { getUserAvatarUrl } from "@/lib/imageUrl";

const verificationStatuses = ["All", "verified", "pending", "rejected"];
const aiVerifiedOptions = ["All", "true", "false"];

export function Teams() {
  const { notify } = useNotifications();
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState("All");
  const [aiVerifiedFilter, setAiVerifiedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [teamToAction, setTeamToAction] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadTeams = async () => {
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
      const res = await getAdminTeams(params);
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setTeams(list);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
      });
    } catch (err) {
      setError(err.message || "Failed to load teams");
      setTeams([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const res = await getTeamStatistics();
      setStatistics(res.statistics || null);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  useEffect(() => {
    loadTeams();
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, verificationStatusFilter, aiVerifiedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadTeams();
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map(t => t.id));
    }
  };

  const handleSelectTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleApproveClick = (team) => {
    setTeamToAction(team);
    setVerificationNotes("");
    setShowApproveDialog(true);
  };

  const handleRejectClick = (team) => {
    setTeamToAction(team);
    setVerificationNotes("");
    setShowRejectDialog(true);
  };

  const handleResetClick = async (team) => {
    if (!confirm(`Reset verification for ${team.name}?`)) return;
    try {
      setActionLoading(true);
      await resetTeamVerification(team.id);
      notify('Team verification reset successfully', { color: 'green' });
      loadTeams();
    } catch (err) {
      notify(err.message || 'Failed to reset verification', { color: 'red' });
    } finally {
      setActionLoading(false);
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

  const handleApproveConfirm = async () => {
    if (!teamToAction) return;
    try {
      setActionLoading(true);
      await approveTeam(teamToAction.id, verificationNotes);
      notify('Team approved successfully', { color: 'green' });
      setShowApproveDialog(false);
      setTeamToAction(null);
      setVerificationNotes("");
      loadTeams();
    } catch (err) {
      notify(err.message || 'Failed to approve team', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!teamToAction || !verificationNotes.trim()) {
      notify('Verification notes are required', { color: 'amber' });
      return;
    }
    try {
      setActionLoading(true);
      await rejectTeam(teamToAction.id, verificationNotes);
      notify('Team verification rejected', { color: 'green' });
      setShowRejectDialog(false);
      setTeamToAction(null);
      setVerificationNotes("");
      loadTeams();
    } catch (err) {
      notify(err.message || 'Failed to reject team', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const getCertificationStatus = (team) => {
    return team.certification_status || "pending";
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <UserGroupIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Total Teams</Typography>
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
              <div className="rounded-lg bg-red-500/10 p-3">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Rejected</Typography>
                <Typography variant="h4" color="red">{statistics.rejected || 0}</Typography>
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

      {/* Main Teams Card */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h6" color="white">
                Team Verification
              </Typography>
              <Typography variant="small" className="text-white/90">
                Review and verify team registrations
              </Typography>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <form onSubmit={handleSearch} className="w-full md:w-72">
                <Input 
                  label="Search teams" 
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
                    checked={selectedTeams.length === teams.length && teams.length > 0}
                    onChange={handleSelectAll}
                    color="gray"
                  />
                </th>
                {[
                  { key: "name", label: "team name" },
                  { key: "creator", label: "creator" },
                  { key: "sport", label: "sport" },
                  { key: "certification_status", label: "status" },
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 px-5 text-center text-blue-gray-400">
                    Loading teams...
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 px-5 text-center text-blue-gray-400">
                    No teams found.
                  </td>
                </tr>
              ) : (
                teams.map((team, idx) => {
                  const status = getCertificationStatus(team);
                  const isPending = status === "pending";
                  
                  return (
                    <tr key={team.id}>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Checkbox
                          checked={selectedTeams.includes(team.id)}
                          onChange={() => handleSelectTeam(team.id)}
                          color="gray"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-2">
                          {team.creator && (
                            <Avatar
                              src={getUserAvatarUrl(team.creator)}
                              alt={team.name || "Team"}
                              size="sm"
                              variant="rounded"
                            />
                          )}
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {team.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        {team.creator && (
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={getUserAvatarUrl(team.creator)}
                              alt={team.creator.username || "Creator"}
                              size="sm"
                              variant="rounded"
                            />
                            <div>
                              <Typography variant="small" className="font-semibold">
                                {team.creator.first_name && team.creator.last_name
                                  ? `${team.creator.first_name} ${team.creator.last_name}`
                                  : team.creator.username || team.creator.email?.split("@")[0]}
                              </Typography>
                              <Typography className="text-xs text-blue-gray-500">
                                @{team.creator.username || team.creator.email?.split("@")[0] || "—"}
                              </Typography>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Chip
                          variant="gradient"
                          color="blue"
                          value={team.sport?.name || team.sport || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex flex-col gap-1">
                          <StatusChip status={status} type="document" />
                          {team.verified_by_ai !== undefined && (
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={team.verified_by_ai ? "AI" : "Manual"}
                              color={team.verified_by_ai ? "blue" : "gray"}
                              className="py-0.5 px-2 text-[10px] w-fit"
                            />
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {team.created_at ? new Date(team.created_at).toLocaleDateString() : "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== teams.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-1">
                          {isPending && (
                            <>
                              <IconButton 
                                variant="text" 
                                color="green"
                                onClick={() => handleApproveClick(team)}
                                title="Approve team"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </IconButton>
                              <IconButton 
                                variant="text" 
                                color="red"
                                onClick={() => handleRejectClick(team)}
                                title="Reject team"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </IconButton>
                            </>
                          )}
                          {!isPending && (
                            <IconButton 
                              variant="text" 
                              color="amber"
                              onClick={() => handleResetClick(team)}
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
                              <Link href={`/dashboard/teams/${team.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </MenuItem>
                              </Link>
                              <Link href={`/dashboard/documents?entity_type=team&q=${team.id}`}>
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
          <Typography variant="h5" color="blue-gray">Approve Team</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setShowApproveDialog(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Approve <strong>{teamToAction?.name}</strong>?
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
          <Typography variant="h5" color="blue-gray">Reject Team</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setShowRejectDialog(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Reject <strong>{teamToAction?.name}</strong>?
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
            Page {pagination.current_page} of {pagination.last_page} • Total {pagination.total} teams
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

export default Teams;

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
  UserPlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  EyeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminUsers,
  deleteAdminUser,
  banAdminUser,
  unbanAdminUser,
  getAdminUserActivity,
  approveProAthlete,
  rejectProAthlete,
  getUserDocuments,
} from "@/services/adminUserService";
import { exportUsers } from "@/services/adminExportService";
import { useNotifications } from "@/context/notifications";
import Link from "next/link";
import { getUserAvatarUrl } from "@/lib/imageUrl";

const roles = ["All", "Organizer", "Player", "Coach"];
const statuses = ["All", "Active", "Inactive", "Banned"];
const banTypes = ["temporary", "permanent"];
const aiVerifiedOptions = ["All", "true", "false"];

export function Users() {
  const { notify } = useNotifications();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isProAthleteFilter, setIsProAthleteFilter] = useState("All");
  const [aiVerifiedFilter, setAiVerifiedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Ban/Unban dialog state
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState("temporary");
  const [banDuration, setBanDuration] = useState("7"); // days
  const [actionLoading, setActionLoading] = useState(false);

  // Bulk action dialog state
  const [showBulkBanDialog, setShowBulkBanDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState(null); // 'ban' or 'unban'
  const [bulkReason, setBulkReason] = useState("");
  const [bulkBanType, setBulkBanType] = useState("temporary");
  const [bulkBanDuration, setBulkBanDuration] = useState("7");

  // Pro athlete verification dialogs
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [userToVerify, setUserToVerify] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");

  const loadUsers = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        role: roleFilter !== "All" ? roleFilter : undefined,
        status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
        is_pro_athlete: isProAthleteFilter !== "All" ? (isProAthleteFilter === "true" ? true : false) : undefined,
        ai_verified: aiVerifiedFilter !== "All" ? (aiVerifiedFilter === "true" ? true : false) : undefined,
        page,
        per_page: perPage,
        ...opts,
      };
      const res = await getAdminUsers(params);
      // Laravel paginate() returns { current_page, data, from, last_page, ... total }
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setUsers(list);
      setMeta({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
        from: res.from,
        to: res.to,
      });
    } catch (err) {
      setError(err.message || "Failed to load users");
      setUsers([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, roleFilter, isProAthleteFilter, aiVerifiedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const filtered = users
    .filter((u) => {
      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.fullName ||
        "";
      const username = u.username || "";
      const email = u.email || "";
      const role = u.role?.name || u.role || "";

      const matchesSearch =
        fullName.toLowerCase().includes(query.toLowerCase()) ||
        email.toLowerCase().includes(query.toLowerCase()) ||
        username.toLowerCase().includes(query.toLowerCase()) ||
        (u.contact_number || "").toLowerCase().includes(query.toLowerCase()) ||
        (u.city || "").toLowerCase().includes(query.toLowerCase());
      const matchesRole =
        roleFilter === "All" || role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "All" ||
        (u.status || "").toLowerCase() === statusFilter.toLowerCase() ||
        (u.is_banned && statusFilter === "Banned") ||
        (!u.is_banned && u.status !== "Inactive" && statusFilter === "Active");

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const fieldMap = {
        fullName: (user) =>
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.fullName ||
          "",
        username: (user) => user.username || "",
        email: (user) => user.email || "",
        contact_number: (user) => user.contact_number || "",
        city: (user) => user.city || "",
        created_at: (user) => user.created_at || "",
        registrationDate: (user) => user.created_at || user.registrationDate,
      };

      const getter = fieldMap[sortBy];
      if (!getter) return 0;

      const aVal = getter(a) || "";
      const bVal = getter(b) || "";

      if (sortBy === "registrationDate" || sortBy === "created_at") {
        const aDate = aVal ? new Date(aVal).getTime() : 0;
        const bDate = bVal ? new Date(bVal).getTime() : 0;
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const handleSelectAll = () => {
    if (selectedUsers.length === filtered.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filtered.map(u => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
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

  const handleBanClick = (user) => {
    setUserToBan(user);
    setBanReason("");
    setBanType("temporary");
    setBanDuration("7");
    setShowBanDialog(true);
  };

  const handleBanConfirm = async () => {
    if (!userToBan) return;
    
    const isBanned = userToBan.is_banned || userToBan.status === "Banned";
    
    try {
      setActionLoading(true);
      
      if (isBanned) {
        // Unban user
        await unbanAdminUser(userToBan.id);
        notify('User unbanned successfully', { color: 'green' });
      } else {
        // Ban user
        const banData = {
          reason: banReason,
          ban_type: banType,
        };
        if (banType === 'temporary' && banDuration) {
          banData.duration_days = parseInt(banDuration);
        }
        await banAdminUser(userToBan.id, banData);
        notify('User banned successfully', { color: 'green' });
      }
      
      setShowBanDialog(false);
      setUserToBan(null);
      setBanReason("");
      loadUsers();
    } catch (err) {
      notify(err.message || `Failed to ${isBanned ? 'unban' : 'ban'} user`, { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkBanClick = (action) => {
    if (selectedUsers.length === 0) {
      notify("Please select users to perform this action", { color: 'amber' });
      return;
    }
    setBulkAction(action);
    setBulkReason("");
    setBulkBanType("temporary");
    setBulkBanDuration("7");
    setShowBulkBanDialog(true);
  };

  const handleBulkBanConfirm = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setActionLoading(true);
      
      const results = { success: 0, failed: 0 };
      
      for (const userId of selectedUsers) {
        try {
          if (bulkAction === 'unban') {
            await unbanAdminUser(userId);
          } else {
            const banData = {
              reason: bulkReason,
              ban_type: bulkBanType,
            };
            if (bulkBanType === 'temporary' && bulkBanDuration) {
              banData.duration_days = parseInt(bulkBanDuration);
            }
            await banAdminUser(userId, banData);
          }
          results.success++;
        } catch {
          results.failed++;
        }
      }
      
      if (results.success > 0) {
        notify(
          `Successfully ${bulkAction === 'unban' ? 'unbanned' : 'banned'} ${results.success} user(s)${results.failed > 0 ? `, ${results.failed} failed` : ''}`, 
          { color: results.failed > 0 ? 'amber' : 'green' }
        );
      } else {
        notify(`Failed to ${bulkAction} users`, { color: 'red' });
      }
      
      setShowBulkBanDialog(false);
      setSelectedUsers([]);
      loadUsers();
    } catch (err) {
      notify(err.message || `Failed to ${bulkAction} users`, { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportUsers();
      notify('Export started', { color: 'green' });
    } catch (err) {
      notify(err.message || "Export failed", { color: 'red' });
    }
  };

  const handleApproveProAthlete = async (user) => {
    setUserToVerify(user);
    setVerificationNotes("");
    setShowApproveDialog(true);
  };

  const handleRejectProAthlete = async (user) => {
    setUserToVerify(user);
    setVerificationNotes("");
    setShowRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    if (!userToVerify) return;
    try {
      setActionLoading(true);
      await approveProAthlete(userToVerify.id, verificationNotes);
      notify('Pro athlete approved successfully', { color: 'green' });
      setShowApproveDialog(false);
      setUserToVerify(null);
      setVerificationNotes("");
      loadUsers();
    } catch (err) {
      notify(err.message || 'Failed to approve pro athlete', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!userToVerify || !verificationNotes.trim()) {
      notify('Verification notes are required', { color: 'amber' });
      return;
    }
    try {
      setActionLoading(true);
      await rejectProAthlete(userToVerify.id, verificationNotes);
      notify('Pro athlete verification rejected', { color: 'green' });
      setShowRejectDialog(false);
      setUserToVerify(null);
      setVerificationNotes("");
      loadUsers();
    } catch (err) {
      notify(err.message || 'Failed to reject pro athlete', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const getUserStatus = (user) => {
    if (user.is_banned || user.status === "Banned") return "Banned";
    if (user.status) return user.status;
    return "Active";
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h6" color="white">
                User Management
              </Typography>
              <Typography variant="small" className="text-white/90">
                Manage players, organizers, and coaches
              </Typography>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <form onSubmit={handleSearch} className="w-full md:w-72">
                <Input 
                  label="Search users" 
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
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select 
                label="Role"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e); setPage(1); }}
              >
                {roles.map(role => (
                  <Option key={role} value={role}>{role}</Option>
                ))}
              </Select>
              
              <Select 
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e); setPage(1); }}
              >
                {statuses.map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
              
              <Select 
                label="Pro Athlete"
                value={isProAthleteFilter}
                onChange={(e) => { setIsProAthleteFilter(e); setPage(1); }}
              >
                <Option value="All">All</Option>
                <Option value="true">Pro Athletes</Option>
                <Option value="false">Non-Pro</Option>
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

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <Typography variant="small" color="white">
                {selectedUsers.length} user(s) selected
              </Typography>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="text" 
                  color="white"
                  className="normal-case"
                  onClick={() => handleBulkBanClick("ban")}
                >
                  <NoSymbolIcon className="h-4 w-4 mr-2" />
                  Ban Selected
                </Button>
                <Button 
                  size="sm" 
                  variant="text" 
                  color="white"
                  className="normal-case"
                  onClick={() => handleBulkBanClick("unban")}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Unban Selected
                </Button>
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
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {error && (
            <Typography
              variant="small"
              className="text-red-500 px-6 pt-4 pb-2 font-medium"
            >
              {error}
            </Typography>
          )}
          <table className="w-full min-w-[1200px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Checkbox
                    checked={selectedUsers.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    color="gray"
                  />
                </th>
                {[
                  { key: "photo", label: "" },
                  { key: "username", label: "username" },
                  { key: "fullName", label: "name" },
                  { key: "email", label: "email" },
                  { key: "role", label: "role" },
                  { key: "contact_number", label: "contact" },
                  { key: "city", label: "location" },
                  { key: "status", label: "status" },
                  { key: "registrationDate", label: "joined" },
                  { key: "actions", label: "" }
                ].map((col) => (
                  <th key={col.key} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <button
                      onClick={() => col.key !== "photo" && col.key !== "actions" && handleSort(col.key)}
                      className="flex items-center gap-1 font-semibold text-blue-gray-400 hover:text-blue-gray-600"
                    >
                      <Typography variant="small" className="text-[11px] font-bold uppercase">
                        {col.label}
                      </Typography>
                      {col.key !== "photo" && col.key !== "actions" && (
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
                  <td
                    colSpan={10}
                    className="py-6 px-5 text-center text-blue-gray-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-6 px-5 text-center text-blue-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  const userStatus = getUserStatus(u);
                  const isBanned = userStatus === "Banned";
                  
                  return (
                    <tr key={u.id} className={isBanned ? "bg-red-50/50" : ""}>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Checkbox
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleSelectUser(u.id)}
                          color="gray"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Avatar
                          src={getUserAvatarUrl(u)}
                          alt={
                            [u.first_name, u.last_name].filter(Boolean).join(" ") ||
                            u.fullName ||
                            u.username ||
                            ""
                          }
                          size="sm"
                          variant="rounded"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {u.username || "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {[u.first_name, u.last_name].filter(Boolean).join(" ") ||
                            u.fullName ||
                            "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {u.email}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Chip
                          variant="gradient"
                          color="blue"
                          value={u.role?.name || u.role || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {u.contact_number || "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {u.city || "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex flex-col gap-1">
                          <Chip
                            variant="ghost"
                            color={isBanned ? "red" : userStatus === "Active" ? "green" : "gray"}
                            value={userStatus}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                          {u.is_pro_athlete && (
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={u.verified_at ? "Pro Athlete" : "Pending Verification"}
                              color={u.verified_at ? "green" : "amber"}
                              className="py-0.5 px-2 text-[10px] w-fit"
                            />
                          )}
                          {u.verification_source && (
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={u.verification_source === "ai" ? "AI Verified" : "Manual"}
                              color={u.verification_source === "ai" ? "blue" : "gray"}
                              className="py-0.5 px-2 text-[10px] w-fit"
                            />
                          )}
                          {isBanned && u.ban_reason && (
                            <Typography className="text-xs text-red-500 mt-1 truncate max-w-[120px]" title={u.ban_reason}>
                              {u.ban_reason}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {new Date(
                            u.created_at || u.registrationDate || new Date()
                          ).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-1">
                          <IconButton 
                            variant="text" 
                            color={isBanned ? "green" : "red"}
                            onClick={() => handleBanClick(u)}
                            title={isBanned ? "Unban user" : "Ban user"}
                          >
                            {isBanned ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <NoSymbolIcon className="h-5 w-5" />
                            )}
                          </IconButton>
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton variant="text" color="blue-gray">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <Link href={`/dashboard/users/${u.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </MenuItem>
                              </Link>
                              {u.is_pro_athlete && !u.verified_at && (
                                <>
                                  <MenuItem 
                                    className="flex items-center gap-2 text-green-600"
                                    onClick={() => handleApproveProAthlete(u)}
                                  >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Approve Pro Athlete
                                  </MenuItem>
                                  <MenuItem 
                                    className="flex items-center gap-2 text-red-600"
                                    onClick={() => handleRejectProAthlete(u)}
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                    Reject Pro Athlete
                                  </MenuItem>
                                </>
                              )}
                              <Link href={`/dashboard/documents?entity_type=user&q=${u.id}`}>
                                <MenuItem className="flex items-center gap-2">
                                  <DocumentTextIcon className="h-4 w-4" />
                                  View Documents
                                </MenuItem>
                              </Link>
                              <MenuItem 
                                className={`flex items-center gap-2 ${isBanned ? 'text-green-600' : 'text-red-600'}`}
                                onClick={() => handleBanClick(u)}
                              >
                                {isBanned ? (
                                  <>
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Unban User
                                  </>
                                ) : (
                                  <>
                                    <NoSymbolIcon className="h-4 w-4" />
                                    Ban User
                                  </>
                                )}
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
        </CardBody>
      </Card>

      {/* Single User Ban/Unban Dialog */}
      <Dialog 
        open={showBanDialog} 
        handler={() => setShowBanDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            {(userToBan?.is_banned || userToBan?.status === "Banned") ? "Unban User" : "Ban User"}
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowBanDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            {(userToBan?.is_banned || userToBan?.status === "Banned") ? (
              <>Are you sure you want to unban <strong>{userToBan?.fullName || userToBan?.username || `User #${userToBan?.id}`}</strong>?</>
            ) : (
              <>Are you sure you want to ban <strong>{userToBan?.fullName || userToBan?.username || `User #${userToBan?.id}`}</strong>?</>
            )}
          </Typography>
          
          {!(userToBan?.is_banned || userToBan?.status === "Banned") && (
            <>
              <Textarea
                label="Reason for ban"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                placeholder="Explain why this user is being banned..."
              />
              
              <Select
                label="Ban Type"
                value={banType}
                onChange={(val) => setBanType(val)}
              >
                <Option value="temporary">Temporary</Option>
                <Option value="permanent">Permanent</Option>
              </Select>
              
              {banType === "temporary" && (
                <Input
                  type="number"
                  label="Duration (days)"
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  min="1"
                  max="365"
                />
              )}
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowBanDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color={(userToBan?.is_banned || userToBan?.status === "Banned") ? "green" : "red"}
            onClick={handleBanConfirm}
            disabled={actionLoading}
          >
            {actionLoading 
              ? "Processing..." 
              : (userToBan?.is_banned || userToBan?.status === "Banned") 
                ? "Unban User" 
                : "Ban User"
            }
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Bulk Ban/Unban Dialog */}
      <Dialog 
        open={showBulkBanDialog} 
        handler={() => setShowBulkBanDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            {bulkAction === "unban" ? "Unban Users" : "Ban Users"}
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowBulkBanDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            {bulkAction === "unban" ? (
              <>Are you sure you want to unban <strong>{selectedUsers.length} user(s)</strong>?</>
            ) : (
              <>Are you sure you want to ban <strong>{selectedUsers.length} user(s)</strong>?</>
            )}
          </Typography>
          
          {bulkAction === "ban" && (
            <>
              <Textarea
                label="Reason for ban"
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                rows={3}
                placeholder="Explain why these users are being banned..."
              />
              
              <Select
                label="Ban Type"
                value={bulkBanType}
                onChange={(val) => setBulkBanType(val)}
              >
                <Option value="temporary">Temporary</Option>
                <Option value="permanent">Permanent</Option>
              </Select>
              
              {bulkBanType === "temporary" && (
                <Input
                  type="number"
                  label="Duration (days)"
                  value={bulkBanDuration}
                  onChange={(e) => setBulkBanDuration(e.target.value)}
                  min="1"
                  max="365"
                />
              )}
            </>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowBulkBanDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color={bulkAction === "unban" ? "green" : "red"}
            onClick={handleBulkBanConfirm}
            disabled={actionLoading}
          >
            {actionLoading 
              ? "Processing..." 
              : bulkAction === "unban" 
                ? `Unban ${selectedUsers.length} User(s)` 
                : `Ban ${selectedUsers.length} User(s)`
            }
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Approve Pro Athlete Dialog */}
      <Dialog 
        open={showApproveDialog} 
        handler={() => setShowApproveDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Approve Pro Athlete
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowApproveDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Approve <strong>{userToVerify?.username || userToVerify?.email}</strong> as a Pro Athlete?
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
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowApproveDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleApproveConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Pro Athlete Dialog */}
      <Dialog 
        open={showRejectDialog} 
        handler={() => setShowRejectDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Reject Pro Athlete Verification
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowRejectDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody className="space-y-4">
          <Typography variant="paragraph" color="blue-gray">
            Reject Pro Athlete verification for <strong>{userToVerify?.username || userToVerify?.email}</strong>?
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
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowRejectDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleRejectConfirm}
            disabled={actionLoading || !verificationNotes.trim()}
          >
            {actionLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between mt-4">
          <Typography variant="small" className="text-blue-gray-600">
            Page {meta.current_page} of {meta.last_page} • Total {meta.total}{" "}
            users
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
              disabled={meta && page >= meta.last_page}
              onClick={() =>
                setPage((p) =>
                  meta ? Math.min(meta.last_page, p + 1) : p + 1
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

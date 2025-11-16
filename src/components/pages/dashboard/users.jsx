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
} from "@heroicons/react/24/solid";
import {
  getAdminUsers,
  deleteAdminUser,
} from "@/services/adminUserService";
import { exportUsers } from "@/services/adminExportService";

const roles = ["All", "Organizer", "Player", "Coach"];
const sports = ["All", "Basketball", "Badminton", "Football", "Tennis", "Volleyball", "Swimming"];
const statuses = ["All", "Active", "Inactive", "Banned"];

export function Users() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [userToBan, setUserToBan] = useState(null);

  const loadUsers = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        role: roleFilter !== "All" ? roleFilter : undefined,
        page,
        per_page: perPage,
        ...opts,
      };
      const res = await getAdminUsers(params);
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
      setMeta(res.meta || null);
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
  }, [page]);

  const filtered = users
    .filter((u) => {
      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.fullName ||
        "";
      const username = u.username || "";
      const email = u.email || "";
      const role = u.role?.name || u.role || "";
      const mainSport = u.mainSport || "";

      const matchesSearch =
        fullName.toLowerCase().includes(query.toLowerCase()) ||
        email.toLowerCase().includes(query.toLowerCase()) ||
        username.toLowerCase().includes(query.toLowerCase());
      const matchesRole =
        roleFilter === "All" || role.toLowerCase() === roleFilter.toLowerCase();
      const matchesSport =
        sportFilter === "All" ||
        mainSport.toLowerCase() === sportFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "All" ||
        (u.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesSport && matchesStatus;
    })
    .sort((a, b) => {
      const fieldMap = {
        fullName: (user) =>
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.fullName ||
          "",
        username: (user) => user.username || "",
        email: (user) => user.email || "",
        mainSport: (user) => user.mainSport || "",
        registrationDate: (user) => user.created_at || user.registrationDate,
      };

      const getter = fieldMap[sortBy];
      if (!getter) return 0;

      const aVal = getter(a) || "";
      const bVal = getter(b) || "";

      if (sortBy === "registrationDate") {
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

  const handleBanUser = (user) => {
    setUserToBan(user);
    setShowBanDialog(true);
  };

  const handleExport = async () => {
    try {
      await exportUsers();
    } catch (err) {
      alert(err.message || "Export failed");
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert("Please select users to perform this action");
      return;
    }
    
    if (action === "ban") {
      alert(`Ban ${selectedUsers.length} user(s)?`);
    } else if (action === "unban") {
      alert(`Unban ${selectedUsers.length} user(s)?`);
    }
    
    setSelectedUsers([]);
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
              <div className="w-full md:w-72">
                <Input 
                  label="Search users" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  labelProps={{ className: '!text-white' }}
                />
              </div>
              <Button 
                variant="text" 
                color="white"
                className="hidden md:flex"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </Button>
              <Button 
                variant="filled" 
                color="white"
                className="normal-case text-blue-gray-900 flex items-center gap-2 whitespace-nowrap bg-white hover:bg-white/90 h-10"
              >
                <UserPlusIcon className="h-5 w-5" />
                Add User
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select 
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e)}
              >
                {roles.map(role => (
                  <Option key={role} value={role}>{role}</Option>
                ))}
              </Select>
              
              <Select 
                label="Sport"
                value={sportFilter}
                onChange={(e) => setSportFilter(e)}
              >
                {sports.map(sport => (
                  <Option key={sport} value={sport}>{sport}</Option>
                ))}
              </Select>
              
              <Select 
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e)}
              >
                {statuses.map(status => (
                  <Option key={status} value={status}>{status}</Option>
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
                onClick={() => handleBulkAction("ban")}
              >
                <NoSymbolIcon className="h-4 w-4 mr-2" />
                Ban Selected
              </Button>
                <Button 
                  size="sm" 
                  variant="text" 
                  color="white"
                  className="normal-case"
                  onClick={() => handleBulkAction("unban")}
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
                  { key: "mainSport", label: "main sport" },
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
                  return (
                    <tr key={u.id}>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Checkbox
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleSelectUser(u.id)}
                          color="gray"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Avatar
                          src={u.avatar}
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
                        <Chip
                          variant="gradient"
                          color="purple"
                          value={u.mainSport || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <StatusChip status={u.status || "Active"} type="user" />
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {new Date(
                            u.created_at || u.registrationDate || new Date()
                          ).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-2">
                          <IconButton 
                            variant="text" 
                            color={u.status === "Banned" ? "green" : "red"}
                            onClick={() => handleBanUser(u)}
                            title={u.status === "Banned" ? "Unban user" : "Ban user"}
                          >
                            {u.status === "Banned" ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <NoSymbolIcon className="h-5 w-5" />
                            )}
                          </IconButton>
                          <IconButton variant="text" color="blue-gray">
                            <PencilSquareIcon className="h-5 w-5" />
                          </IconButton>
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton variant="text" color="blue-gray">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem onClick={() => window.open(`/dashboard/users/${u.id}`, '_blank')}>
                                View Details
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

      {/* Ban/Unban Confirmation Dialog */}
      <Dialog 
        open={showBanDialog} 
        handler={() => setShowBanDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            {userToBan?.status === "Banned" ? "Unban User" : "Ban User"}
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowBanDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to {userToBan?.status === "Banned" ? "unban" : "ban"} <strong>{userToBan?.fullName}</strong>?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowBanDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color={userToBan?.status === "Banned" ? "green" : "red"}
            onClick={() => {
              alert(`${userToBan?.status === "Banned" ? "User unbanned" : "User banned"} successfully!`);
              setShowBanDialog(false);
              setUserToBan(null);
            }}
          >
            {userToBan?.status === "Banned" ? "Unban User" : "Ban User"}
          </Button>
        </DialogFooter>
      </Dialog>

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

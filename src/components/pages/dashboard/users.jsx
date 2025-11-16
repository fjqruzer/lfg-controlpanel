import React, { useState } from "react";
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
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

// Mock user data with all required fields
const mockUsers = [
  { 
    id: 1, 
    username: "marco_santos",
    fullName: "Marco Santos", 
    email: "marco@example.com", 
    role: "Organizer", 
    status: "Active", 
    mainSport: "Basketball",
    registrationDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/80?img=1",
    eventsCreated: 45,
    eventsJoined: 32,
    rating: 4.8
  },
  { 
    id: 2, 
    username: "bea_lim",
    fullName: "Bea Lim", 
    email: "bea@example.com", 
    role: "Player", 
    status: "Active", 
    mainSport: "Badminton",
    registrationDate: "2024-02-20",
    avatar: "https://i.pravatar.cc/80?img=2",
    eventsCreated: 12,
    eventsJoined: 67,
    rating: 4.9
  },
  { 
    id: 3, 
    username: "ken_reyes",
    fullName: "Ken Reyes", 
    email: "ken@example.com", 
    role: "Player", 
    status: "Banned", 
    mainSport: "Football",
    registrationDate: "2024-01-08",
    avatar: "https://i.pravatar.cc/80?img=3",
    eventsCreated: 8,
    eventsJoined: 45,
    rating: 3.2
  },
  { 
    id: 4, 
    username: "toni_cruz",
    fullName: "Toni Cruz", 
    email: "toni@example.com", 
    role: "Coach", 
    status: "Active", 
    mainSport: "Tennis",
    registrationDate: "2024-03-10",
    avatar: "https://i.pravatar.cc/80?img=4",
    eventsCreated: 28,
    eventsJoined: 15,
    rating: 4.7
  },
  { 
    id: 5, 
    username: "ana_garcia",
    fullName: "Ana Garcia", 
    email: "ana@example.com", 
    role: "Player", 
    status: "Active", 
    mainSport: "Volleyball",
    registrationDate: "2024-02-14",
    avatar: "https://i.pravatar.cc/80?img=5",
    eventsCreated: 15,
    eventsJoined: 89,
    rating: 4.6
  },
  { 
    id: 6, 
    username: "carlos_lopez",
    fullName: "Carlos Lopez", 
    email: "carlos@example.com", 
    role: "Organizer", 
    status: "Active", 
    mainSport: "Basketball",
    registrationDate: "2023-12-05",
    avatar: "https://i.pravatar.cc/80?img=6",
    eventsCreated: 67,
    eventsJoined: 23,
    rating: 4.9
  },
  { 
    id: 7, 
    username: "sara_martinez",
    fullName: "Sara Martinez", 
    email: "sara@example.com", 
    role: "Player", 
    status: "Banned", 
    mainSport: "Swimming",
    registrationDate: "2024-01-22",
    avatar: "https://i.pravatar.cc/80?img=7",
    eventsCreated: 5,
    eventsJoined: 34,
    rating: 2.8
  },
];

const roles = ["All", "Organizer", "Player", "Coach"];
const sports = ["All", "Basketball", "Badminton", "Football", "Tennis", "Volleyball", "Swimming"];
const statuses = ["All", "Active", "Inactive", "Banned"];

export function Users() {
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [userToBan, setUserToBan] = useState(null);

  // Filter and sort users
  const filtered = mockUsers
    .filter((u) => {
      const matchesSearch = u.fullName.toLowerCase().includes(query.toLowerCase()) || 
                           u.email.toLowerCase().includes(query.toLowerCase()) ||
                           u.username.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesSport = sportFilter === "All" || u.mainSport === sportFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesSport && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "fullName" || sortBy === "username" || sortBy === "email" || sortBy === "mainSport") {
        return sortOrder === "asc" 
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy]);
      }
      if (sortBy === "registrationDate") {
        return sortOrder === "asc" 
          ? new Date(a.registrationDate) - new Date(b.registrationDate)
          : new Date(b.registrationDate) - new Date(a.registrationDate);
      }
      return 0;
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

  const handleExport = (format) => {
    const dataToExport = selectedUsers.length > 0 
      ? mockUsers.filter(u => selectedUsers.includes(u.id))
      : filtered;
    
    if (format === "csv") {
      // Create CSV content
      const headers = ["Username", "Full Name", "Email", "Role", "Main Sport", "Status", "Registration Date"];
      const rows = dataToExport.map(u => [
        u.username,
        u.fullName,
        u.email,
        u.role,
        u.mainSport,
        u.status,
        u.registrationDate
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
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
                  onClick={() => handleExport("csv")}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
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
              {filtered.map((u, idx) => (
                <tr key={u.id}>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Checkbox
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => handleSelectUser(u.id)}
                      color="gray"
                    />
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Avatar src={u.avatar} alt={u.fullName} size="sm" variant="rounded" />
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {u.username}
                    </Typography>
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {u.fullName}
                    </Typography>
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Typography className="text-xs font-semibold text-blue-gray-600">{u.email}</Typography>
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Chip variant="gradient" color="blue" value={u.role} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Chip variant="gradient" color="purple" value={u.mainSport} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <StatusChip status={u.status} type="user" />
                  </td>
                  <td className={`py-3 px-5 ${idx !== filtered.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                    <Typography className="text-xs font-normal text-blue-gray-600">
                      {new Date(u.registrationDate).toLocaleDateString()}
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
              ))}
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
    </div>
  );
}

export default Users;

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
  StatusChip,
} from "@/components/ui";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  banAdminUser,
  unbanAdminUser,
  getAdminUserActivity,
} from "@/services/adminUserService";
import { getUserAvatarUrl } from "@/lib/imageUrl";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/notifications";
import Link from "next/link";

export function UserDetail({ userId }) {
  const router = useRouter();
  const { notify } = useNotifications();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role_id: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Ban dialog state
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState("temporary");
  const [banDuration, setBanDuration] = useState("7");
  const [banLoading, setBanLoading] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminUser(userId);
      setUser(res.user || res);
      
      // Load activity
      try {
        const activityRes = await getAdminUserActivity(userId);
        setActivity(activityRes);
      } catch {
        // Activity is optional
      }
    } catch (err) {
      setError(err.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const handleEditClick = () => {
    setEditData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      email: user?.email || "",
      role_id: user?.role_id || "",
    });
    setShowEditDialog(true);
  };

  const handleEditConfirm = async () => {
    try {
      setEditLoading(true);
      await updateAdminUser(userId, editData);
      notify("User updated successfully", { color: "green" });
      setShowEditDialog(false);
      loadUser();
    } catch (err) {
      notify(err.message || "Failed to update user", { color: "red" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await deleteAdminUser(userId);
      notify("User deleted successfully", { color: "green" });
      router.push("/dashboard/users");
    } catch (err) {
      notify(err.message || "Failed to delete user", { color: "red" });
      setDeleteLoading(false);
    }
  };

  const handleBanClick = () => {
    setBanReason("");
    setBanType("temporary");
    setBanDuration("7");
    setShowBanDialog(true);
  };

  const handleBanConfirm = async () => {
    const isBanned = user?.is_banned || user?.status === "Banned";
    
    try {
      setBanLoading(true);
      
      if (isBanned) {
        await unbanAdminUser(userId);
        notify("User unbanned successfully", { color: "green" });
      } else {
        const banData = {
          reason: banReason,
          ban_type: banType,
        };
        if (banType === "temporary" && banDuration) {
          banData.duration_days = parseInt(banDuration);
        }
        await banAdminUser(userId, banData);
        notify("User banned successfully", { color: "green" });
      }
      
      setShowBanDialog(false);
      loadUser();
    } catch (err) {
      notify(err.message || `Failed to ${isBanned ? "unban" : "ban"} user`, { color: "red" });
    } finally {
      setBanLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 mb-8 flex justify-center">
        <Typography color="blue-gray">Loading user...</Typography>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mt-8 mb-8">
        <Card className="p-6">
          <Typography color="red" className="text-center">{error || "User not found"}</Typography>
          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={() => router.push("/dashboard/users")}>
              Back to Users
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isBanned = user.is_banned || user.status === "Banned";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
  const location = [user.city, user.province].filter(Boolean).join(", ") || "—";

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => router.push("/dashboard/users")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <div>
            <Typography variant="h5" color="blue-gray">
              User Details
            </Typography>
            <Typography variant="small" className="text-blue-gray-500">
              {fullName} (@{user.username || "—"})
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            className="flex items-center gap-2"
            onClick={handleEditClick}
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outlined"
            color={isBanned ? "green" : "red"}
            className="flex items-center gap-2"
            onClick={handleBanClick}
          >
            {isBanned ? (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                Unban
              </>
            ) : (
              <>
                <NoSymbolIcon className="h-4 w-4" />
                Ban
              </>
            )}
          </Button>
          <Button
            variant="outlined"
            color="red"
            className="flex items-center gap-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="p-6">
              <Typography variant="h6" color="white">
                Personal Information
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Full Name
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {fullName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Username
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.username || "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Email
                  </Typography>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-blue-gray-400" />
                    <Typography color="blue-gray" className="font-medium">
                      {user.email}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Contact Number
                  </Typography>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-blue-gray-400" />
                    <Typography color="blue-gray" className="font-medium">
                      {user.contact_number || "—"}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Birthday
                  </Typography>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-gray-400" />
                    <Typography color="blue-gray" className="font-medium">
                      {user.birthday ? new Date(user.birthday).toLocaleDateString() : "—"}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Sex
                  </Typography>
                  <Chip
                    variant="gradient"
                    color="blue"
                    value={user.sex || "—"}
                    className="w-fit capitalize"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="p-6">
              <Typography variant="h6" color="white">
                Address Information
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Barangay
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.barangay || "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    City
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.city || "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Province
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.province || "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Zip Code
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.zip_code || "—"}
                  </Typography>
                </div>
                <div className="md:col-span-2">
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Full Address
                  </Typography>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-blue-gray-400" />
                    <Typography color="blue-gray" className="font-medium">
                      {location}
                    </Typography>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="p-6">
              <Typography variant="h6" color="white">
                Account Information
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Role
                  </Typography>
                  <Chip
                    variant="gradient"
                    color="blue"
                    value={user.role?.name || user.role || "—"}
                    className="w-fit"
                  />
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Status
                  </Typography>
                  <StatusChip
                    status={isBanned ? "Banned" : user.status || "Active"}
                    type="user"
                  />
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Registered
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Last Updated
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {user.updated_at ? new Date(user.updated_at).toLocaleString() : "—"}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Profile Photo */}
          <Card>
            <CardBody>
              <div className="flex flex-col items-center text-center">
                <Avatar
                  src={getUserAvatarUrl(user)}
                  alt={fullName}
                  size="xl"
                  variant="rounded"
                  className="mb-4"
                />
                <Typography variant="h6" color="blue-gray">
                  {fullName}
                </Typography>
                <Typography className="text-blue-gray-500 mb-2">
                  @{user.username || "—"}
                </Typography>
                <StatusChip
                  status={isBanned ? "Banned" : user.status || "Active"}
                  type="user"
                />
              </div>
            </CardBody>
          </Card>

          {/* Activity Stats */}
          {activity && (
            <Card>
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <ChartBarIcon className="h-5 w-5 text-blue-gray-400" />
                  <Typography variant="h6" color="blue-gray">
                    Activity Statistics
                  </Typography>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-blue-gray-500">
                      Posts/Messages
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {activity.posts || 0}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-blue-gray-500">
                      Events Participated
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {activity.events_participated || 0}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-blue-gray-500">
                      Event Check-ins
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {activity.events_checkins || 0}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-blue-gray-500">
                      Tickets Submitted
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {activity.tickets_submitted || 0}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Quick Actions
              </Typography>
              <div className="flex flex-col gap-2">
                <Link href={`/dashboard/documents?user_id=${user.id}`}>
                  <Button variant="outlined" size="sm" className="w-full justify-start">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Edit User
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowEditDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="First Name"
              value={editData.first_name}
              onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
            />
            <Input
              label="Last Name"
              value={editData.last_name}
              onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
            />
            <Input
              label="Username"
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowEditDialog(false)}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button color="blue-gray" onClick={handleEditConfirm} disabled={editLoading}>
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} handler={() => setShowDeleteDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Delete User
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowDeleteDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to delete {fullName}? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowDeleteDialog(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} handler={() => setShowBanDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            {isBanned ? "Unban User" : "Ban User"}
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
          {!isBanned && (
            <div className="flex flex-col gap-4">
              <Select
                label="Ban Type"
                value={banType}
                onChange={(e) => setBanType(e)}
              >
                <Option value="temporary">Temporary</Option>
                <Option value="permanent">Permanent</Option>
              </Select>
              {banType === "temporary" && (
                <Input
                  label="Duration (days)"
                  type="number"
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                />
              )}
              <Textarea
                label="Reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
          {isBanned && (
            <Typography variant="paragraph" color="blue-gray">
              Are you sure you want to unban {fullName}?
            </Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowBanDialog(false)}
            disabled={banLoading}
          >
            Cancel
          </Button>
          <Button
            color={isBanned ? "green" : "red"}
            onClick={handleBanConfirm}
            disabled={banLoading}
          >
            {banLoading ? "Processing..." : isBanned ? "Unban User" : "Ban User"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
























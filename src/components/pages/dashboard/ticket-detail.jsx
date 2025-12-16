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
  Select,
  Option,
  StatusChip,
  Input,
  Textarea,
} from "@/components/ui";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminTicket,
  updateAdminTicket,
  closeAdminTicket,
} from "@/services/adminTicketService";
import { getUserAvatarUrl } from "@/lib/imageUrl";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/notifications";

const ticketStatuses = ["open", "in_progress", "closed"];

export function TicketDetail({ ticketId }) {
  const router = useRouter();
  const { notify } = useNotifications();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Update dialog state
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    assigned_to: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Close dialog state
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminTicket(ticketId);
      setTicket(res.ticket || res);
    } catch (err) {
      setError(err.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const handleUpdateClick = () => {
    setUpdateData({
      status: ticket?.status || "",
      assigned_to: ticket?.assigned_to || "",
    });
    setShowUpdateDialog(true);
  };

  const handleUpdateConfirm = async () => {
    try {
      setUpdateLoading(true);
      await updateAdminTicket(ticketId, updateData);
      notify("Ticket updated successfully", { color: "green" });
      setShowUpdateDialog(false);
      loadTicket();
    } catch (err) {
      notify(err.message || "Failed to update ticket", { color: "red" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCloseConfirm = async () => {
    try {
      setCloseLoading(true);
      await closeAdminTicket(ticketId);
      notify("Ticket closed successfully", { color: "green" });
      setShowCloseDialog(false);
      loadTicket();
    } catch (err) {
      notify(err.message || "Failed to close ticket", { color: "red" });
    } finally {
      setCloseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 mb-8 flex justify-center">
        <Typography color="blue-gray">Loading ticket...</Typography>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="mt-8 mb-8">
        <Card className="p-6">
          <Typography color="red" className="text-center">{error || "Ticket not found"}</Typography>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/dashboard/tickets")}>
              Back to Tickets
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isClosed = ticket.status === "closed";

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => router.push("/dashboard/tickets")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <div>
            <Typography variant="h5" color="blue-gray">
              Ticket #{ticket.id}
            </Typography>
            <Typography variant="small" className="text-blue-gray-500">
              {ticket.subject}
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isClosed && (
            <>
              <Button
                variant="outlined"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={handleUpdateClick}
              >
                <PencilSquareIcon className="h-4 w-4" />
                Update
              </Button>
              <Button
                variant="outlined"
                color="green"
                className="flex items-center gap-2"
                onClick={() => setShowCloseDialog(true)}
              >
                <CheckCircleIcon className="h-4 w-4" />
                Close Ticket
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="p-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" color="white">
                  Ticket Details
                </Typography>
                <StatusChip status={ticket.status || "open"} type="ticket" />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Subject
                  </Typography>
                  <Typography color="blue-gray" className="font-medium text-lg">
                    {ticket.subject}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">
                    Description
                  </Typography>
                  <Typography color="blue-gray" className="bg-blue-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {ticket.description || "—"}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Submitter Info */}
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Submitted By
              </Typography>
              {ticket.submitter ? (
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={getUserAvatarUrl(ticket.submitter)}
                    alt={ticket.submitter.username || ticket.submitter.email}
                    size="xl"
                    variant="rounded"
                    className="mb-4"
                  />
                  <Typography variant="h6" color="blue-gray">
                    {ticket.submitter.first_name} {ticket.submitter.last_name}
                  </Typography>
                  <Typography className="text-blue-gray-500 mb-2">
                    @{ticket.submitter.username || "—"}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {ticket.submitter.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push(`/dashboard/users/${ticket.submitter.id}`)}
                  >
                    View User Profile
                  </Button>
                </div>
              ) : (
                <Typography className="text-blue-gray-500 text-center">
                  Submitter information not available
                </Typography>
              )}
            </CardBody>
          </Card>

          {/* Assignee Info */}
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Assigned To
              </Typography>
              {ticket.assignee ? (
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={getUserAvatarUrl(ticket.assignee)}
                    alt={ticket.assignee.username || ticket.assignee.email}
                    size="xl"
                    variant="rounded"
                    className="mb-4"
                  />
                  <Typography variant="h6" color="blue-gray">
                    {ticket.assignee.first_name} {ticket.assignee.last_name}
                  </Typography>
                  <Typography className="text-blue-gray-500 mb-2">
                    @{ticket.assignee.username || "—"}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {ticket.assignee.email}
                  </Typography>
                </div>
              ) : (
                <Typography className="text-blue-gray-500 text-center">
                  Unassigned
                </Typography>
              )}
            </CardBody>
          </Card>

          {/* Ticket Info */}
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Ticket Information
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">ID</Typography>
                  <Typography variant="small" color="blue-gray" className="font-mono">
                    #{ticket.id}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">Status</Typography>
                  <StatusChip status={ticket.status || "open"} type="ticket" />
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">Created</Typography>
                  <Typography variant="small" color="blue-gray">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "—"}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">Updated</Typography>
                  <Typography variant="small" color="blue-gray">
                    {ticket.updated_at ? new Date(ticket.updated_at).toLocaleString() : "—"}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} handler={() => setShowUpdateDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Update Ticket
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowUpdateDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Select
              label="Status"
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e })}
            >
              {ticketStatuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
            <Input
              label="Assign To (User ID, optional)"
              type="number"
              value={updateData.assigned_to}
              onChange={(e) => setUpdateData({ ...updateData, assigned_to: e.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowUpdateDialog(false)}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button color="blue-gray" onClick={handleUpdateConfirm} disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Update Ticket"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={showCloseDialog} handler={() => setShowCloseDialog(false)} size="sm">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Close Ticket
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowCloseDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to close this ticket? This action can be undone by updating the status.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowCloseDialog(false)}
            disabled={closeLoading}
          >
            Cancel
          </Button>
          <Button color="green" onClick={handleCloseConfirm} disabled={closeLoading}>
            {closeLoading ? "Closing..." : "Close Ticket"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}




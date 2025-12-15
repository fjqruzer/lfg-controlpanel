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
  Input,
  Chip,
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
  TicketIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminTickets,
  createAdminTicket,
  updateAdminTicket,
  closeAdminTicket,
} from "@/services/adminTicketService";
import { getUserAvatarUrl } from "@/lib/imageUrl";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/notifications";
import Link from "next/link";

const statuses = ["All", "open", "in_progress", "closed"];
const ticketStatuses = ["open", "in_progress", "closed"];

export function Tickets() {
  const router = useRouter();
  const { notify } = useNotifications();
  const [query, setQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Create ticket dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createData, setCreateData] = useState({
    submitted_by: "",
    subject: "",
    description: "",
    assigned_to: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  
  // Update ticket dialog
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    assigned_to: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        assignee: assigneeFilter || undefined,
        page,
        per_page: perPage,
      };
      const res = await getAdminTickets(params);
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setTickets(list);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
        from: res.from,
        to: res.to,
      });
    } catch (err) {
      setError(err.message || "Failed to load tickets");
      setTickets([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, assigneeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadTickets();
  };

  const handleCreateClick = () => {
    setCreateData({
      submitted_by: "",
      subject: "",
      description: "",
      assigned_to: "",
    });
    setShowCreateDialog(true);
  };

  const handleCreateConfirm = async () => {
    try {
      setCreateLoading(true);
      await createAdminTicket(createData);
      notify("Ticket created successfully", { color: "green" });
      setShowCreateDialog(false);
      loadTickets();
    } catch (err) {
      notify(err.message || "Failed to create ticket", { color: "red" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateClick = (ticket) => {
    setTicketToUpdate(ticket);
    setUpdateData({
      status: ticket.status || "",
      assigned_to: ticket.assigned_to || "",
    });
    setShowUpdateDialog(true);
  };

  const handleUpdateConfirm = async () => {
    if (!ticketToUpdate) return;
    
    try {
      setUpdateLoading(true);
      await updateAdminTicket(ticketToUpdate.id, updateData);
      notify("Ticket updated successfully", { color: "green" });
      setShowUpdateDialog(false);
      setTicketToUpdate(null);
      loadTickets();
    } catch (err) {
      notify(err.message || "Failed to update ticket", { color: "red" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await closeAdminTicket(ticketId);
      notify("Ticket closed successfully", { color: "green" });
      loadTickets();
    } catch (err) {
      notify(err.message || "Failed to close ticket", { color: "red" });
    }
  };

  const handleViewDetails = (ticket) => {
    router.push(`/dashboard/tickets/${ticket.id}`);
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" color="blue-gray">
            Support Tickets
          </Typography>
          <Typography variant="small" className="text-blue-gray-500">
            Manage and respond to support tickets
          </Typography>
        </div>
        <Button
          color="blue-gray"
          className="flex items-center gap-2"
          onClick={handleCreateClick}
        >
          <PlusIcon className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tickets..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5" />
              </IconButton>
              <Button type="submit" color="blue-gray">
                Search
              </Button>
            </div>
            
            {showFilters && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e); setPage(1); }}
                >
                  {statuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
                <Input
                  label="Assignee ID"
                  type="number"
                  value={assigneeFilter}
                  onChange={(e) => { setAssigneeFilter(e.target.value); setPage(1); }}
                  placeholder="Filter by assignee..."
                />
              </div>
            )}
          </form>
        </CardBody>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Tickets ({pagination?.total || 0})
          </Typography>
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
          <table className="w-full min-w-[1000px] table-auto">
            <thead>
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "subject", label: "Subject" },
                  { key: "submitter", label: "Submitted By" },
                  { key: "assignee", label: "Assigned To" },
                  { key: "status", label: "Status" },
                  { key: "created_at", label: "Created" },
                  { key: "actions", label: "" }
                ].map((col) => (
                  <th key={col.key} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {col.label}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-5 text-center text-blue-gray-400"
                  >
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-5 text-center text-blue-gray-400"
                  >
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, idx) => (
                  <tr key={ticket.id}>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        #{ticket.id}
                      </Typography>
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {ticket.subject || "—"}
                      </Typography>
                      {ticket.description && (
                        <Typography className="text-xs text-blue-gray-400 mt-1 line-clamp-1">
                          {ticket.description.substring(0, 50)}...
                        </Typography>
                      )}
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      {ticket.submitter ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={getUserAvatarUrl(ticket.submitter)}
                            alt={ticket.submitter.username || ticket.submitter.email}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {ticket.submitter.username || ticket.submitter.email}
                            </Typography>
                            {ticket.submitter.email && (
                              <Typography className="text-xs text-blue-gray-400">
                                {ticket.submitter.email}
                              </Typography>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Typography variant="small" color="blue-gray">
                          —
                        </Typography>
                      )}
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      {ticket.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={getUserAvatarUrl(ticket.assignee)}
                            alt={ticket.assignee.username || ticket.assignee.email}
                            size="sm"
                            variant="rounded"
                          />
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {ticket.assignee.username || ticket.assignee.email}
                          </Typography>
                        </div>
                      ) : (
                        <Typography variant="small" color="blue-gray" className="text-blue-gray-400">
                          Unassigned
                        </Typography>
                      )}
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      <StatusChip status={ticket.status || "open"} type="ticket" />
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      <Typography className="text-xs font-normal text-blue-gray-600">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "—"}
                      </Typography>
                    </td>
                    <td className={`py-3 px-5 ${idx !== tickets.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                      <div className="flex items-center gap-1">
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          onClick={() => handleViewDetails(ticket)}
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton variant="text" color="blue-gray">
                              <EllipsisVerticalIcon className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem onClick={() => handleViewDetails(ticket)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </MenuItem>
                            <MenuItem onClick={() => handleUpdateClick(ticket)}>
                              <PencilSquareIcon className="h-4 w-4 mr-2" />
                              Update
                            </MenuItem>
                            {ticket.status !== "closed" && (
                              <MenuItem onClick={() => handleCloseTicket(ticket.id)}>
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Close Ticket
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-blue-gray-500">
            Showing {pagination.from} to {pagination.to} of {pagination.total} tickets
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Typography variant="small" className="text-blue-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </Typography>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
              disabled={page === pagination.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} handler={() => setShowCreateDialog(false)} size="lg">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Create Ticket
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowCreateDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Submitted By (User ID)"
              type="number"
              value={createData.submitted_by}
              onChange={(e) => setCreateData({ ...createData, submitted_by: e.target.value })}
              required
            />
            <Input
              label="Subject"
              value={createData.subject}
              onChange={(e) => setCreateData({ ...createData, subject: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              value={createData.description}
              onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
              rows={5}
              required
            />
            <Input
              label="Assign To (User ID, optional)"
              type="number"
              value={createData.assigned_to}
              onChange={(e) => setCreateData({ ...createData, assigned_to: e.target.value })}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowCreateDialog(false)}
            disabled={createLoading}
          >
            Cancel
          </Button>
          <Button color="blue-gray" onClick={handleCreateConfirm} disabled={createLoading}>
            {createLoading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Update Ticket Dialog */}
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
    </div>
  );
}


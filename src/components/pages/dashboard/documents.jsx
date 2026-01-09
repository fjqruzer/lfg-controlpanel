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
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminDocuments,
  getDocumentStatistics,
  verifyDocument,
  rejectDocument,
  resetDocument,
  downloadDocument,
  deleteDocument,
} from "@/services/adminDocumentService";
import { useRouter } from "next/navigation";
import { getUserAvatarUrl, getDocumentFileUrl } from "@/lib/imageUrl";
import { useNotifications } from "@/context/notifications";

const documentTypes = ["All", "license", "id", "passport", "proof_of_address", "other"];
const statuses = ["All", "pending", "verified", "rejected"];
const entityTypes = ["All", "user", "venue", "team", "coach"];
const documentCategories = ["All", "athlete_certification", "venue_business", "team_registration", "coach_license", "other"];

export function Documents() {
  const router = useRouter();
  const { notify } = useNotifications();
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [entityTypeFilter, setEntityTypeFilter] = useState("All");
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState("All");
  const [aiVerifiedFilter, setAiVerifiedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Dialog states
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [docToAction, setDocToAction] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        q: query || undefined,
        document_type: typeFilter !== "All" ? typeFilter : undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        entity_type: entityTypeFilter !== "All" ? entityTypeFilter : undefined,
        document_category: documentCategoryFilter !== "All" ? documentCategoryFilter : undefined,
        ai_verified: aiVerifiedFilter !== "All" ? (aiVerifiedFilter === "true" ? true : false) : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        per_page: perPage,
      };
      const res = await getAdminDocuments(params);
      const list = res.data || [];
      setDocuments(list);
      setPagination(res.pagination || {
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
        total: res.total,
      });
    } catch (err) {
      setError(err.message || "Failed to load documents");
      setDocuments([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const res = await getDocumentStatistics();
      setStatistics(res.statistics || null);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, typeFilter, statusFilter, entityTypeFilter, documentCategoryFilter, aiVerifiedFilter, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadDocuments();
  };

  const handleSelectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(d => d.id));
    }
  };

  const handleSelectDoc = (docId) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
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

  const handleVerifyClick = (doc) => {
    setDocToAction(doc);
    setActionNotes("");
    setShowVerifyDialog(true);
  };

  const handleRejectClick = (doc) => {
    setDocToAction(doc);
    setActionNotes("");
    setShowRejectDialog(true);
  };

  const handleResetClick = async (doc) => {
    if (!confirm(`Reset verification for "${doc.document_name || doc.entity_name}"?`)) return;
    try {
      setActionLoading(true);
      await resetDocument(doc.id);
      notify('Document verification reset successfully', { color: 'green' });
      loadDocuments();
      loadStatistics();
    } catch (err) {
      notify(err.message || 'Failed to reset document verification', { color: 'red' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (doc) => {
    setDocToAction(doc);
    setShowDeleteDialog(true);
  };

  const handleVerifyConfirm = async () => {
    if (!docToAction) return;
    try {
      setActionLoading(true);
      await verifyDocument(docToAction.id, actionNotes);
      setShowVerifyDialog(false);
      setDocToAction(null);
      setActionNotes("");
      loadDocuments();
      loadStatistics();
    } catch (err) {
      alert(err.message || "Failed to verify document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!docToAction) return;
    try {
      setActionLoading(true);
      await rejectDocument(docToAction.id, actionNotes);
      setShowRejectDialog(false);
      setDocToAction(null);
      setActionNotes("");
      loadDocuments();
      loadStatistics();
    } catch (err) {
      alert(err.message || "Failed to reject document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await deleteDocument(docToAction.id);
      setShowDeleteDialog(false);
      setDocToAction(null);
      loadDocuments();
      loadStatistics();
    } catch (err) {
      alert(err.message || "Failed to delete document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocument(doc.id);
    } catch (err) {
      alert(err.message || "Download failed");
    }
  };

  const handleViewDetails = (doc) => {
    router.push(`/dashboard/documents/${doc.id}`);
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Total Documents</Typography>
                <Typography variant="h4" color="blue-gray">{statistics.total || 0}</Typography>
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
              <div className="rounded-lg bg-red-500/10 p-3">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600">Rejected</Typography>
                <Typography variant="h4" color="red">{statistics.rejected || 0}</Typography>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Documents Card */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h6" color="white">
                Document Verification
              </Typography>
              <Typography variant="small" className="text-white/90">
                Review and verify user-submitted documents
              </Typography>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <form onSubmit={handleSearch} className="w-full md:w-72">
                <Input 
                  label="Search documents" 
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
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select 
                label="Entity Type"
                value={entityTypeFilter}
                onChange={(e) => { setEntityTypeFilter(e); setPage(1); }}
              >
                {entityTypes.map(type => (
                  <Option key={type} value={type}>{type === "All" ? "All Entities" : type.charAt(0).toUpperCase() + type.slice(1)}</Option>
                ))}
              </Select>
              
              <Select 
                label="Document Category"
                value={documentCategoryFilter}
                onChange={(e) => { setDocumentCategoryFilter(e); setPage(1); }}
              >
                {documentCategories.map(cat => (
                  <Option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat.replace("_", " ")}</Option>
                ))}
              </Select>
              
              <Select 
                label="Document Type"
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e); setPage(1); }}
              >
                {documentTypes.map(type => (
                  <Option key={type} value={type}>{type === "All" ? "All Types" : type.replace("_", " ")}</Option>
                ))}
              </Select>
              
              <Select 
                label="Status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e); setPage(1); }}
              >
                {statuses.map(status => (
                  <Option key={status} value={status}>{status === "All" ? "All Statuses" : status}</Option>
                ))}
              </Select>
              
              <Select 
                label="AI Verified"
                value={aiVerifiedFilter}
                onChange={(e) => { setAiVerifiedFilter(e); setPage(1); }}
              >
                <Option value="All">All</Option>
                <Option value="true">AI Verified</Option>
                <Option value="false">Manual</Option>
              </Select>
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
          <table className="w-full min-w-[1000px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Checkbox
                    checked={selectedDocs.length === documents.length && documents.length > 0}
                    onChange={handleSelectAll}
                    color="gray"
                  />
                </th>
                {[
                  { key: "entity", label: "entity" },
                  { key: "entity_type", label: "entity type" },
                  { key: "document_name", label: "document name" },
                  { key: "document_category", label: "category" },
                  { key: "document_type", label: "type" },
                  { key: "verification_status", label: "status" },
                  { key: "created_at", label: "submitted" },
                  { key: "expiry_date", label: "expiry" },
                  { key: "actions", label: "" }
                ].map((col) => (
                  <th key={col.key} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <button
                      onClick={() => col.key !== "actions" && col.key !== "user" && handleSort(col.key)}
                      className="flex items-center gap-1 font-semibold text-blue-gray-400 hover:text-blue-gray-600"
                    >
                      <Typography variant="small" className="text-[11px] font-bold uppercase">
                        {col.label}
                      </Typography>
                      {col.key !== "actions" && col.key !== "entity" && col.key !== "entity_type" && (
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
                    Loading documents...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-6 px-5 text-center text-blue-gray-400"
                  >
                    No documents found.
                  </td>
                </tr>
              ) : (
                documents.map((doc, idx) => {
                  const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
                  return (
                    <tr key={doc.id}>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Checkbox
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => handleSelectDoc(doc.id)}
                          color="gray"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-2">
                          {(() => {
                            // Determine entity for avatar display
                            const entityUser = doc.user || doc.documentable?.user || doc.documentable;
                            const entityType = doc.entity_type_display || doc.documentable_type?.split('\\').pop()?.toLowerCase();
                            
                            // For user/coach entities, show user avatar
                            if (entityType === 'user' || entityType === 'coach' && entityUser) {
                              return (
                                <>
                                  <Avatar
                                    src={getUserAvatarUrl(entityUser)}
                                    alt={doc.entity_name || entityUser.username || "Entity"}
                                    size="sm"
                                    variant="rounded"
                                  />
                                  <div>
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {doc.entity_name || entityUser.username || entityUser.first_name || "—"}
                                    </Typography>
                                    {entityUser.email && (
                                      <Typography className="text-xs text-blue-gray-400">
                                        {entityUser.email}
                                      </Typography>
                                    )}
                                  </div>
                                </>
                              );
                            }
                            
                            // For team entities, show creator avatar if available
                            if (entityType === 'team' && doc.documentable?.creator) {
                              return (
                                <>
                                  <Avatar
                                    src={getUserAvatarUrl(doc.documentable.creator)}
                                    alt={doc.entity_name || "Team"}
                                    size="sm"
                                    variant="rounded"
                                  />
                                  <div>
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {doc.entity_name || doc.documentable?.name || "—"}
                                    </Typography>
                                    <Typography className="text-xs text-blue-gray-400">
                                      Team
                                    </Typography>
                                  </div>
                                </>
                              );
                            }
                            
                            // For venue entities, show owner avatar if available
                            if (entityType === 'venue' && (doc.documentable?.owner || doc.documentable?.user)) {
                              return (
                                <>
                                  <Avatar
                                    src={getUserAvatarUrl(doc.documentable.owner || doc.documentable.user)}
                                    alt={doc.entity_name || "Venue"}
                                    size="sm"
                                    variant="rounded"
                                  />
                                  <div>
                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                      {doc.entity_name || doc.documentable?.name || "—"}
                                    </Typography>
                                    <Typography className="text-xs text-blue-gray-400">
                                      Venue
                                    </Typography>
                                  </div>
                                </>
                              );
                            }
                            
                            // Fallback: just show name
                            return (
                              <Typography variant="small" color="blue-gray" className="font-semibold">
                                {doc.entity_name || doc.user?.username || doc.documentable?.name || "—"}
                              </Typography>
                            );
                          })()}
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Chip
                          variant="ghost"
                          color="blue-gray"
                          value={doc.entity_type_display || doc.documentable_type?.split('\\').pop() || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {doc.document_name || "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Chip
                          variant="ghost"
                          color="gray"
                          value={doc.document_category?.replace("_", " ") || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Chip
                          variant="gradient"
                          color="blue"
                          value={doc.document_type?.replace("_", " ") || "—"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex flex-col gap-1">
                          <StatusChip status={doc.verification_status || "pending"} type="document" />
                          {doc.verified_by_ai !== undefined && (
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={doc.verified_by_ai ? "AI" : "Manual"}
                              color={doc.verified_by_ai ? "blue" : "gray"}
                              className="py-0.5 px-2 text-[10px] w-fit"
                            />
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <Typography className={`text-xs font-normal ${isExpired ? "text-red-500" : "text-blue-gray-600"}`}>
                          {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : "—"}
                          {isExpired && " (Expired)"}
                        </Typography>
                      </td>
                      <td className={`py-3 px-5 ${idx !== documents.length - 1 ? "border-b border-blue-gray-50" : ""}`}>
                        <div className="flex items-center gap-2">
                          {doc.verification_status === "pending" && (
                            <>
                              <IconButton 
                                variant="text" 
                                color="green"
                                onClick={() => handleVerifyClick(doc)}
                                title="Verify document"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </IconButton>
                              <IconButton 
                                variant="text" 
                                color="red"
                                onClick={() => handleRejectClick(doc)}
                                title="Reject document"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </IconButton>
                            </>
                          )}
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton variant="text" color="blue-gray">
                                <EllipsisVerticalIcon className="h-5 w-5" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem onClick={() => handleViewDetails(doc)}>
                                <EyeIcon className="h-4 w-4 mr-2 inline" />
                                View Details
                              </MenuItem>
                              <MenuItem onClick={() => handleDownload(doc)}>
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline" />
                                Download
                              </MenuItem>
                              {(doc.verification_status === "verified" || doc.verification_status === "rejected") && (
                                <MenuItem onClick={() => handleResetClick(doc)}>
                                  <ArrowPathIcon className="h-4 w-4 mr-2 inline" />
                                  Reset Verification
                                </MenuItem>
                              )}
                              <MenuItem 
                                className="text-red-500"
                                onClick={() => handleDeleteClick(doc)}
                              >
                                <TrashIcon className="h-4 w-4 mr-2 inline" />
                                Delete
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

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-blue-gray-600">
            Page {pagination.current_page} of {pagination.last_page} • Total {pagination.total} documents
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

      {/* Verify Confirmation Dialog */}
      <Dialog 
        open={showVerifyDialog} 
        handler={() => setShowVerifyDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Verify Document
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowVerifyDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray" className="mb-4">
            Are you sure you want to verify "{docToAction?.document_name || docToAction?.entity_name}"?
          </Typography>
          <Textarea
            label="Verification Notes (optional)"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={3}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowVerifyDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleVerifyConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Verify"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog 
        open={showRejectDialog} 
        handler={() => setShowRejectDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Reject Document
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowRejectDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray" className="mb-4">
            Are you sure you want to reject "{docToAction?.document_name || docToAction?.entity_name}"?
          </Typography>
          <Textarea
            label="Rejection Reason (Required)"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={3}
            required
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowRejectDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleRejectConfirm}
            disabled={actionLoading || !actionNotes.trim()}
          >
            {actionLoading ? "Processing..." : "Reject"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteDialog} 
        handler={() => setShowDeleteDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Delete Document
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
            Are you sure you want to permanently delete "{docToAction?.document_name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowDeleteDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Documents;




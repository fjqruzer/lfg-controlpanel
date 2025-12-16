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
  StatusChip,
  Textarea,
} from "@/components/ui";
import { 
  ArrowLeftIcon,
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  getAdminDocument,
  verifyDocument,
  rejectDocument,
  resetDocument,
  downloadDocument,
} from "@/services/adminDocumentService";
import {
  getDocumentAIAnalysis,
  reprocessDocumentAI,
} from "@/services/adminAIDocumentService";
import { useRouter } from "next/navigation";
import { getUserAvatarUrl, getDocumentFileUrl } from "@/lib/imageUrl";

export function DocumentDetail({ documentId }) {
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Dialog states
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDocument(documentId);
      setDocument(res.document || res);
    } catch (err) {
      setError(err.message || "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    try {
      setAiLoading(true);
      const res = await getDocumentAIAnalysis(documentId);
      setAiAnalysis(res);
    } catch (err) {
      console.error("AI analysis not available:", err);
      setAiAnalysis(null);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      loadDocument();
      loadAIAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleVerifyConfirm = async () => {
    try {
      setActionLoading(true);
      await verifyDocument(documentId, actionNotes);
      setShowVerifyDialog(false);
      setActionNotes("");
      loadDocument();
    } catch (err) {
      alert(err.message || "Failed to verify document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      setActionLoading(true);
      await rejectDocument(documentId, actionNotes);
      setShowRejectDialog(false);
      setActionNotes("");
      loadDocument();
    } catch (err) {
      alert(err.message || "Failed to reject document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetConfirm = async () => {
    try {
      setActionLoading(true);
      await resetDocument(documentId);
      setShowResetDialog(false);
      loadDocument();
    } catch (err) {
      alert(err.message || "Failed to reset document");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadDocument(documentId);
    } catch (err) {
      alert(err.message || "Download failed");
    }
  };

  const handleReprocessAI = async () => {
    try {
      setAiLoading(true);
      await reprocessDocumentAI(documentId);
      loadAIAnalysis();
    } catch (err) {
      alert(err.message || "AI reprocessing failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 mb-8 flex justify-center">
        <Typography color="blue-gray">Loading document...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 mb-8">
        <Card className="p-6">
          <Typography color="red" className="text-center">{error}</Typography>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/dashboard/documents")}>
              Back to Documents
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="mt-8 mb-8">
        <Card className="p-6">
          <Typography color="blue-gray" className="text-center">Document not found</Typography>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/dashboard/documents")}>
              Back to Documents
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isExpired = document.expiry_date && new Date(document.expiry_date) < new Date();
  const isPending = document.verification_status === "pending";

  return (
    <div className="mt-8 mb-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => router.push("/dashboard/documents")}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </IconButton>
        <div>
          <Typography variant="h5" color="blue-gray">
            Document Review
          </Typography>
          <Typography variant="small" className="text-blue-gray-500">
            {document.document_name}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Document Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Document Details Card */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                  <div>
                    <Typography variant="h6" color="white">
                      {document.document_name}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {document.document_type?.replace("_", " ") || "Document"}
                    </Typography>
                  </div>
                </div>
                <StatusChip status={document.verification_status || "pending"} type="document" />
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">Reference Number</Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {document.reference_number || "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">Document Type</Typography>
                  <Chip
                    variant="gradient"
                    color="blue"
                    value={document.document_type?.replace("_", " ") || "—"}
                    className="w-fit"
                  />
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">Issue Date</Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {document.issue_date ? new Date(document.issue_date).toLocaleDateString() : "—"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-500 mb-1">Expiry Date</Typography>
                  <Typography className={`font-medium ${isExpired ? "text-red-500" : "text-blue-gray-900"}`}>
                    {document.expiry_date ? new Date(document.expiry_date).toLocaleDateString() : "—"}
                    {isExpired && " (Expired)"}
                  </Typography>
                </div>
                <div className="md:col-span-2">
                  <Typography variant="small" className="text-blue-gray-500 mb-1">Submitted</Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {document.created_at ? new Date(document.created_at).toLocaleString() : "—"}
                  </Typography>
                </div>
                {document.custom_type && (
                  <div className="md:col-span-2">
                    <Typography variant="small" className="text-blue-gray-500 mb-1">Custom Type</Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {document.custom_type}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  className="flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Document
                </Button>
                {isPending && (
                  <>
                    <Button
                      color="green"
                      className="flex items-center gap-2"
                      onClick={() => { setActionNotes(""); setShowVerifyDialog(true); }}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      color="red"
                      className="flex items-center gap-2"
                      onClick={() => { setActionNotes(""); setShowRejectDialog(true); }}
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {!isPending && (
                  <Button
                    variant="outlined"
                    color="amber"
                    className="flex items-center gap-2"
                    onClick={() => setShowResetDialog(true)}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Reset to Pending
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Document Preview */}
          {document.file_path && (
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Document Preview
                </Typography>
                {document.file_type?.startsWith('image/') ? (
                  <div className="flex justify-center">
                    <img
                      src={getDocumentFileUrl(document)}
                      alt={document.document_name}
                      className="max-w-full max-h-96 rounded-lg border border-blue-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center text-blue-gray-500">
                      <Typography>Image preview unavailable</Typography>
                      <Button
                        variant="outlined"
                        size="sm"
                        className="mt-2"
                        onClick={handleDownload}
                      >
                        Download to view
                      </Button>
                    </div>
                  </div>
                ) : document.file_type === 'application/pdf' ? (
                  <div className="w-full">
                    <iframe
                      src={getDocumentFileUrl(document)}
                      className="w-full h-96 rounded-lg border border-blue-gray-200"
                      title={document.document_name}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Typography className="text-blue-gray-500 mb-4">
                      Preview not available for this file type
                    </Typography>
                    <Button
                      variant="outlined"
                      color="blue-gray"
                      onClick={handleDownload}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download to view
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Verification History */}
          {(document.verified_at || document.verification_notes) && (
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Verification Details
                </Typography>
                <div className="space-y-4">
                  {document.verified_at && (
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-5 w-5 text-blue-gray-400" />
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">
                          {document.verification_status === "verified" ? "Verified" : "Reviewed"} on
                        </Typography>
                        <Typography color="blue-gray" className="font-medium">
                          {new Date(document.verified_at).toLocaleString()}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {document.verifier && (
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-5 w-5 text-blue-gray-400" />
                      <div>
                        <Typography variant="small" className="text-blue-gray-500">
                          Reviewed by
                        </Typography>
                        <Typography color="blue-gray" className="font-medium">
                          {document.verifier.username}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {document.verification_notes && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500 mb-1">
                        Notes
                      </Typography>
                      <Typography color="blue-gray" className="bg-blue-gray-50 p-3 rounded-lg">
                        {document.verification_notes}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* AI Analysis */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-purple-500" />
                  <Typography variant="h6" color="blue-gray">
                    AI Analysis
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="outlined"
                  color="purple"
                  className="flex items-center gap-2"
                  onClick={handleReprocessAI}
                  disabled={aiLoading}
                >
                  <ArrowPathIcon className={`h-4 w-4 ${aiLoading ? "animate-spin" : ""}`} />
                  {aiLoading ? "Processing..." : "Reprocess"}
                </Button>
              </div>
              {aiLoading ? (
                <Typography className="text-blue-gray-500 text-center py-4">
                  Loading AI analysis...
                </Typography>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  {aiAnalysis.confidence_score !== undefined && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500 mb-1">
                        Confidence Score
                      </Typography>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-gray-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              aiAnalysis.confidence_score >= 0.8 ? "bg-green-500" :
                              aiAnalysis.confidence_score >= 0.5 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${aiAnalysis.confidence_score * 100}%` }}
                          />
                        </div>
                        <Typography className="font-medium text-blue-gray-700">
                          {Math.round(aiAnalysis.confidence_score * 100)}%
                        </Typography>
                      </div>
                    </div>
                  )}
                  {aiAnalysis.detected_issues && aiAnalysis.detected_issues.length > 0 && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500 mb-2">
                        Detected Issues
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {aiAnalysis.detected_issues.map((issue, idx) => (
                          <li key={idx} className="text-blue-gray-700">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiAnalysis.recommendation && (
                    <div>
                      <Typography variant="small" className="text-blue-gray-500 mb-1">
                        AI Recommendation
                      </Typography>
                      <Chip
                        variant="gradient"
                        color={aiAnalysis.recommendation === "approve" ? "green" : 
                               aiAnalysis.recommendation === "reject" ? "red" : "amber"}
                        value={aiAnalysis.recommendation}
                        className="w-fit"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Typography className="text-blue-gray-500 text-center py-4">
                  AI analysis not available for this document
                </Typography>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - User Info */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Document Owner
              </Typography>
              {document.user ? (
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={getUserAvatarUrl(document.user)}
                    alt={document.user.username}
                    size="xl"
                    variant="rounded"
                    className="mb-4"
                  />
                  <Typography variant="h6" color="blue-gray">
                    {document.user.first_name} {document.user.last_name}
                  </Typography>
                  <Typography className="text-blue-gray-500 mb-2">
                    @{document.user.username}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {document.user.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push(`/dashboard/users/${document.user.id}`)}
                  >
                    View User Profile
                  </Button>
                </div>
              ) : (
                <Typography className="text-blue-gray-500 text-center">
                  User information not available
                </Typography>
              )}
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Document Info
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">ID</Typography>
                  <Typography variant="small" color="blue-gray" className="font-mono">
                    #{document.id}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">Status</Typography>
                  <StatusChip status={document.verification_status || "pending"} type="document" />
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-blue-gray-500">File</Typography>
                  <Typography variant="small" color="blue-gray">
                    {document.file_path ? "Available" : "Not uploaded"}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Verify Dialog */}
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
            Are you sure you want to verify "{document.document_name}"?
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
            {actionLoading ? "Processing..." : "Verify Document"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Dialog */}
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
            Are you sure you want to reject "{document.document_name}"?
          </Typography>
          <Textarea
            label="Rejection Reason"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={3}
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
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Reject Document"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog 
        open={showResetDialog} 
        handler={() => setShowResetDialog(false)}
        size="sm"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Reset Document Status
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setShowResetDialog(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Are you sure you want to reset "{document.document_name}" to pending status?
            This will clear the previous verification decision.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowResetDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            color="amber"
            onClick={handleResetConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Reset to Pending"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default DocumentDetail;




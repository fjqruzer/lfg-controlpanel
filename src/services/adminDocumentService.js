// src/services/adminDocumentService.js
import { apiClient } from "@/lib/apiClient";
import { getAuthToken } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// List all documents with filtering
export const getAdminDocuments = (params = {}) =>
  apiClient.get("/admin/documents", params);

// Get document statistics
export const getDocumentStatistics = () =>
  apiClient.get("/admin/documents/statistics");

// Get specific document details
export const getAdminDocument = (id) =>
  apiClient.get(`/admin/documents/${id}`);

// Get all documents for a specific user
export const getUserDocuments = (userId) =>
  apiClient.get(`/admin/users/${userId}/documents`);

// Verify (approve) a document
export const verifyDocument = (id, notes = "") =>
  apiClient.post(`/admin/documents/${id}/verify`, { verification_notes: notes });

// Reject a document
export const rejectDocument = (id, notes = "") =>
  apiClient.post(`/admin/documents/${id}/reject`, { verification_notes: notes });

// Reset document verification to pending
export const resetDocument = (id) =>
  apiClient.post(`/admin/documents/${id}/reset`, {});

// Bulk verify documents
export const bulkVerifyDocuments = (documentIds, notes = "") =>
  apiClient.post("/admin/documents/bulk-verify", {
    document_ids: documentIds,
    verification_notes: notes,
  });

// Bulk reject documents
export const bulkRejectDocuments = (documentIds, notes = "") =>
  apiClient.post("/admin/documents/bulk-reject", {
    document_ids: documentIds,
    verification_notes: notes,
  });

// Download document file
export const downloadDocument = async (id) => {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/admin/documents/${id}/download`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error("Download failed");
  }

  const blob = await res.blob();
  const contentDisposition = res.headers.get("Content-Disposition");
  let filename = `document-${id}`;
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) {
      filename = match[1];
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Delete document permanently
export const deleteDocument = (id) =>
  apiClient.del(`/admin/documents/${id}`);




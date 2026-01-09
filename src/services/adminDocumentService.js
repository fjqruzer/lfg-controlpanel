// src/services/adminDocumentService.js
import { apiClient } from "@/lib/apiClient";
import { getAuthToken } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// List all entity documents with filtering (polymorphic)
export const getAdminDocuments = (params = {}) =>
  apiClient.get("/admin/entity-documents", params);

// Get document statistics (AI statistics)
export const getDocumentStatistics = () =>
  apiClient.get("/admin/documents/ai/statistics");

// Get specific document details
export const getAdminDocument = (id) =>
  apiClient.get(`/admin/entity-documents/${id}`);

// Note: getUserDocuments moved to adminUserService.js
// This function is kept for backwards compatibility but redirects
export const getUserDocuments = (userId) =>
  apiClient.get(`/admin/users/${userId}/documents`);

// Verify (approve) an entity document
export const verifyDocument = (id, notes = "") =>
  apiClient.post(`/admin/entity-documents/${id}/verify`, { 
    verification_notes: notes 
  });

// Reject an entity document
export const rejectDocument = (id, notes = "") =>
  apiClient.post(`/admin/entity-documents/${id}/reject`, { 
    verification_notes: notes 
  });

// Reset document verification to pending
export const resetDocument = (id) =>
  apiClient.post(`/admin/entity-documents/${id}/reset`, {});

// Download document file
export const downloadDocument = async (id) => {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/admin/entity-documents/${id}/download`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
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
  apiClient.del(`/admin/entity-documents/${id}`);




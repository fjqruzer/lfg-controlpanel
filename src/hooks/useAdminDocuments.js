"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDocuments,
  getDocumentStatistics,
  getAdminDocument,
  getUserDocuments,
  verifyDocument,
  rejectDocument,
  resetDocument,
  bulkVerifyDocuments,
  bulkRejectDocuments,
  deleteDocument,
} from "@/services/adminDocumentService";
import {
  getSmartQueue,
  getAIStatistics,
  getDocumentAIAnalysis,
  reprocessDocumentAI,
  checkAIServiceStatus,
} from "@/services/adminAIDocumentService";

// Document list with filtering
export function useAdminDocuments(filters) {
  return useQuery({
    queryKey: ["admin-documents", filters],
    queryFn: () => getAdminDocuments(filters || {}),
    keepPreviousData: true,
  });
}

// Document statistics
export function useDocumentStatistics() {
  return useQuery({
    queryKey: ["admin-document-statistics"],
    queryFn: getDocumentStatistics,
  });
}

// Single document
export function useAdminDocument(id) {
  return useQuery({
    queryKey: ["admin-document", id],
    queryFn: () => getAdminDocument(id),
    enabled: !!id,
  });
}

// User's documents
export function useUserDocuments(userId) {
  return useQuery({
    queryKey: ["admin-user-documents", userId],
    queryFn: () => getUserDocuments(userId),
    enabled: !!userId,
  });
}

// Verify document mutation
export function useVerifyDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => verifyDocument(id, notes),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-document", variables.id] });
      }
    },
  });
}

// Reject document mutation
export function useRejectDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => rejectDocument(id, notes),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-document", variables.id] });
      }
    },
  });
}

// Reset document mutation
export function useResetDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => resetDocument(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
      qc.invalidateQueries({ queryKey: ["admin-document", id] });
    },
  });
}

// Bulk verify mutation
export function useBulkVerifyDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, notes }) => bulkVerifyDocuments(ids, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
    },
  });
}

// Bulk reject mutation
export function useBulkRejectDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, notes }) => bulkRejectDocuments(ids, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-statistics"] });
    },
  });
}

// AI Smart Queue
export function useSmartQueue() {
  return useQuery({
    queryKey: ["admin-ai-smart-queue"],
    queryFn: getSmartQueue,
  });
}

// AI Statistics
export function useAIStatistics() {
  return useQuery({
    queryKey: ["admin-ai-statistics"],
    queryFn: getAIStatistics,
  });
}

// Document AI Analysis
export function useDocumentAIAnalysis(id) {
  return useQuery({
    queryKey: ["admin-document-ai-analysis", id],
    queryFn: () => getDocumentAIAnalysis(id),
    enabled: !!id,
  });
}

// Reprocess with AI mutation
export function useReprocessDocumentAI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => reprocessDocumentAI(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-document-ai-analysis", id] });
      qc.invalidateQueries({ queryKey: ["admin-ai-smart-queue"] });
    },
  });
}

// AI Service Status
export function useAIServiceStatus() {
  return useQuery({
    queryKey: ["admin-ai-service-status"],
    queryFn: checkAIServiceStatus,
    refetchInterval: 60000, // Check every minute
  });
}




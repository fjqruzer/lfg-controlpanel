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
  deleteDocument,
} from "@/services/adminDocumentService";
import {
  getSmartQueue,
  getAIStatistics,
  getDocumentAIAnalysis,
  reprocessDocumentAI,
  checkAIServiceStatus,
} from "@/services/adminAIDocumentService";

// Entity documents list with filtering (polymorphic)
export function useAdminDocuments(filters) {
  return useQuery({
    queryKey: ["admin-entity-documents", filters],
    queryFn: () => getAdminDocuments(filters || {}),
    keepPreviousData: true,
  });
}

// AI Document statistics
export function useDocumentStatistics() {
  return useQuery({
    queryKey: ["admin-document-ai-statistics"],
    queryFn: getDocumentStatistics,
  });
}

// Single entity document
export function useAdminDocument(id) {
  return useQuery({
    queryKey: ["admin-entity-document", id],
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

// Verify entity document mutation
export function useVerifyDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => verifyDocument(id, notes),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-entity-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-ai-statistics"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-entity-document", variables.id] });
      }
    },
  });
}

// Reject entity document mutation
export function useRejectDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }) => rejectDocument(id, notes),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-entity-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-ai-statistics"] });
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ["admin-entity-document", variables.id] });
      }
    },
  });
}

// Reset entity document mutation
export function useResetDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => resetDocument(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-entity-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-ai-statistics"] });
      qc.invalidateQueries({ queryKey: ["admin-entity-document", id] });
    },
  });
}

// Delete entity document mutation
export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-entity-documents"] });
      qc.invalidateQueries({ queryKey: ["admin-document-ai-statistics"] });
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




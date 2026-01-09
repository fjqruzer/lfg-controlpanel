// src/services/adminAIDocumentService.js
import { apiClient } from "@/lib/apiClient";

// Get smart queue for AI verification
export const getSmartQueue = () =>
  apiClient.get("/admin/documents/ai/smart-queue");

// Get AI verification statistics
export const getAIStatistics = () =>
  apiClient.get("/admin/documents/ai/statistics");

// Get AI analysis for a specific entity document
export const getDocumentAIAnalysis = (id) =>
  apiClient.get(`/admin/entity-documents/${id}/ai-analysis`);

// Reprocess entity document with AI
export const reprocessDocumentAI = (id) =>
  apiClient.post(`/admin/entity-documents/${id}/ai-reprocess`, {});

// Check AI service status
export const checkAIServiceStatus = () =>
  apiClient.get("/admin/ai/check-service");




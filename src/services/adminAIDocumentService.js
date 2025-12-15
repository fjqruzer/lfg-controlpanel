// src/services/adminAIDocumentService.js
import { apiClient } from "@/lib/apiClient";

// Get smart queue for AI verification
export const getSmartQueue = () =>
  apiClient.get("/admin/documents/ai/smart-queue");

// Get AI verification statistics
export const getAIStatistics = () =>
  apiClient.get("/admin/documents/ai/statistics");

// Get AI analysis for a specific document
export const getDocumentAIAnalysis = (id) =>
  apiClient.get(`/admin/documents/${id}/ai-analysis`);

// Reprocess document with AI
export const reprocessDocumentAI = (id) =>
  apiClient.post(`/admin/documents/${id}/ai-reprocess`, {});

// Check AI service status
export const checkAIServiceStatus = () =>
  apiClient.get("/admin/ai/check-service");


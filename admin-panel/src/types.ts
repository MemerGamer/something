import { z } from 'zod';

// Schema definitions for request validation
export const RequestApprovalSchema = z.object({
  requestId: z.string().uuid()
});

export const RequestIdParamSchema = z.object({
  id: z.string().uuid()
});

// Types for our requests
export interface RequestType {
  requestId: string;
  userId: string;
  username: string;
  currentType: string;
  requestedType: string;
  createdAt: string;
}

export interface DashboardStats {
  pendingCount: number;
  recentApproved: Array<{
    requestId: string;
    username: string;
    requestedType: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
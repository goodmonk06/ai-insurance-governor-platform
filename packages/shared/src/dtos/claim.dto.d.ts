import { ClaimType, ClaimStatus } from '../types/enums';
export interface CreateClaimDto {
    policyId: string;
    insuredEntityId: string;
    claimType: ClaimType;
    incidentDate: Date;
    description: string;
    claimedAmount: number;
}
export interface UpdateClaimDto {
    status?: ClaimStatus;
    description?: string;
    claimedAmount?: number;
    approvedAmount?: number;
    paidAmount?: number;
    denialReason?: string;
    adjusterNotes?: Record<string, any>[];
}
export interface ReviewClaimDto {
    status: ClaimStatus;
    approvedAmount?: number;
    denialReason?: string;
    adjusterNotes: Record<string, any>[];
}
export interface ClaimQueryDto {
    tenantId?: string;
    policyId?: string;
    insuredEntityId?: string;
    status?: ClaimStatus;
    claimType?: ClaimType;
    fromDate?: Date;
    toDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=claim.dto.d.ts.map
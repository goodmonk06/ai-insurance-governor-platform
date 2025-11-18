import { DocumentEntityType, DocumentType } from '../types/enums';
export interface CreateDocumentDto {
    entityType: DocumentEntityType;
    entityId: string;
    claimId?: string;
    name: string;
    description?: string;
    fileType: DocumentType;
    fileSize: number;
    storageKey: string;
    storagePath?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}
export interface UpdateDocumentDto {
    name?: string;
    description?: string;
    tags?: string[];
    metadata?: Record<string, any>;
}
export interface DocumentQueryDto {
    tenantId?: string;
    entityType?: DocumentEntityType;
    entityId?: string;
    claimId?: string;
    uploadedById?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=document.dto.d.ts.map
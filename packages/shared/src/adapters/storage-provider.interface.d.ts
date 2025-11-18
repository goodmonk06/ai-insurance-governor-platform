export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    isPublic?: boolean;
    expiresIn?: number;
}
export interface DownloadOptions {
    expiresIn?: number;
}
export interface StorageObject {
    key: string;
    size: number;
    contentType?: string;
    lastModified: Date;
    metadata?: Record<string, string>;
    etag?: string;
}
export interface UploadResult {
    key: string;
    url?: string;
    size: number;
    contentType?: string;
}
/**
 * Adapter interface for file storage operations.
 * Implementations can use S3, Azure Blob Storage, Google Cloud Storage, local filesystem, etc.
 */
export interface IStorageProvider {
    /**
     * Upload a file to storage
     */
    upload(key: string, data: Buffer | ReadableStream, options?: UploadOptions): Promise<UploadResult>;
    /**
     * Download a file from storage
     */
    download(key: string): Promise<Buffer>;
    /**
     * Get a signed URL for direct access (useful for large files)
     */
    getSignedUrl(key: string, options?: DownloadOptions): Promise<string>;
    /**
     * Delete a file from storage
     */
    delete(key: string): Promise<void>;
    /**
     * Check if a file exists
     */
    exists(key: string): Promise<boolean>;
    /**
     * Get file metadata
     */
    getMetadata(key: string): Promise<StorageObject>;
    /**
     * List files in a directory/prefix
     */
    list(prefix: string, maxKeys?: number): Promise<StorageObject[]>;
    /**
     * Copy a file within storage
     */
    copy(sourceKey: string, destinationKey: string): Promise<void>;
    /**
     * Move/rename a file
     */
    move(sourceKey: string, destinationKey: string): Promise<void>;
    /**
     * Get storage provider name
     */
    getProviderName(): string;
}
//# sourceMappingURL=storage-provider.interface.d.ts.map
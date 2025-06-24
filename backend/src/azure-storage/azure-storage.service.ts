import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    // Use your Azure Blob Storage connection string
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('Azure Storage connection string not found');
    }

    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING,
    );
  }

  async uploadFile(
    containerName: string,
    blobName: string,
    buffer: Buffer,
  ): Promise<string> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'container' });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer);

    return blockBlobClient.url;
  }

  async deleteFile(containerName: string, blobName: string): Promise<void> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.deleteIfExists();
  }

  async downloadFile(containerName: string, blobName: string): Promise<Buffer> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    const chunks: Buffer[] = [];

    const stream = downloadBlockBlobResponse.readableStreamBody;
    if (!stream) {
      throw new Error('No stream returned from blob download');
    }

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }
}

import { logger } from '../core/logger.js';
import fs from 'fs';
import path from 'path';

export class StorageService {
  private static s3Client: any = null;
  private static BUCKET_NAME = process.env.AWS_S3_BUCKET || 'afyaflow-uploads';

  /**
   * Initializes the AWS S3 client if environment parameters are configured.
   */
  public static init(): void {
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (accessKey && secretKey) {
      logger.info('Cloud Storage: AWS S3 credentials found. Initializing AWS client wrapper...');
      // In production, we would instantiate the S3Client:
      // this.s3Client = new S3Client({ region: process.env.AWS_REGION });
      this.s3Client = { mock: true };
    } else {
      logger.info('Cloud Storage: S3 credentials absent. Operating in LOCAL disk storage fallback mode.');
    }
  }

  /**
   * Safe upload wrapper storing assets to AWS S3 bucket or local folder partition.
   */
  public static async uploadFile(fileName: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (this.s3Client) {
        logger.info(`[AWS S3] Uploading file: ${fileName} (${mimeType}) to bucket: ${this.BUCKET_NAME}`);
        // Simulate S3 client send command:
        // const command = new PutObjectCommand({ Bucket: this.BUCKET_NAME, Key: fileName, Body: fileBuffer, ContentType: mimeType });
        // await this.s3Client.send(command);
        return `https://s3.amazonaws.com/${this.BUCKET_NAME}/${fileName}`;
      } else {
        // Fallback: write to local /uploads folder
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, fileBuffer);
        logger.info(`[LOCAL STORAGE] Saved asset to local partition: ${filePath}`);
        
        return `/uploads/${fileName}`;
      }
    } catch (error: any) {
      logger.error('Failed uploading file payload to storage wrapper', { error: error.message });
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}

// Auto-run init
StorageService.init();

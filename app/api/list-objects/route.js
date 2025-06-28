import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.UPLOAD_BUCKET,
  });

  const response = await s3.send(command);

  const files = response.Contents?.map((obj) => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
  })) || [];

  return Response.json({ files });
}
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  const type = searchParams.get('type');

  const command = new PutObjectCommand({
    Bucket: process.env.UPLOAD_BUCKET,
    Key: filename,
    ContentType: type,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return Response.json({ url });
}

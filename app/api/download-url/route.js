import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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
  const key = searchParams.get('key');

  const command = new GetObjectCommand({
    Bucket: process.env.UPLOAD_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return Response.json({ url });
}

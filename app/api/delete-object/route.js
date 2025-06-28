import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  const { key } = await req.json();

  const command = new DeleteObjectCommand({
    Bucket: process.env.UPLOAD_BUCKET,
    Key: key,
  });

  await s3.send(command);

  return Response.json({ success: true });
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { Client as MinioClient } from 'minio';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.COMPLAINTS_SERVICE_PORT || 5006;
const BUCKET_NAME = process.env.MINIO_BUCKET || 'complaints';

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: (process.env.MINIO_USE_SSL || 'false').toLowerCase() === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

let bucketReady;

const ensureBucketExists = async () => {
  if (!bucketReady) {
    bucketReady = (async () => {
      const exists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
      if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, '');
        console.log(`Bucket ${BUCKET_NAME} created`);
      }
    })();
  }
  return bucketReady;
};

const listBucketObjects = () =>
  new Promise((resolve, reject) => {
    const items = [];
    const stream = minioClient.listObjectsV2(BUCKET_NAME, '', true);

    stream.on('data', (obj) => items.push(obj));
    stream.on('error', reject);
    stream.on('end', () => resolve(items));
  });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'Complaints Service is running' });
});

app.get('/api/complaints', async (req, res) => {
  try {
    await ensureBucketExists();
    const objects = await listBucketObjects();

    const files = await Promise.all(
      objects.map(async (obj) => {
        const url = await minioClient.presignedGetObject(BUCKET_NAME, obj.name, 24 * 60 * 60);
        return {
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url,
        };
      })
    );

    res.json({ files });
  } catch (error) {
    console.error('Failed to list complaints', error);
    res.status(500).json({ message: 'Failed to list complaints', error: error.message });
  }
});

app.post('/api/complaints/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    await ensureBucketExists();
    const objectName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;

    await minioClient.putObject(BUCKET_NAME, objectName, req.file.buffer, req.file.size, {
      'Content-Type': 'application/pdf',
    });

    const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, 24 * 60 * 60);

    res.status(201).json({
      message: 'Complaint uploaded successfully',
      file: {
        name: objectName,
        url,
      },
    });
  } catch (error) {
    console.error('Failed to upload complaint', error);
    res.status(500).json({ message: 'Failed to upload complaint', error: error.message });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('PDF')) {
    return res.status(400).json({ message: err.message });
  }

  console.error('Unexpected error', err);
  return res.status(500).json({ message: 'Unexpected server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Complaints Service running on port ${PORT}`);
});

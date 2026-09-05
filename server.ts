import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { db, initDatabase, tables } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Initialize database
try {
  initDatabase();
  console.log('Database initialized successfully');
} catch (error: any) {
  console.error('Failed to initialize database:', error.message);
  process.exit(1);
}

// Helper function untuk convert camelCase ke snake_case
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper function untuk convert snake_case ke camelCase
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper function untuk convert object keys dari camelCase ke snake_case
const convertKeysToSnake = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToSnake);
  if (typeof obj !== 'object') return obj;
  
  const converted: any = {};
  for (const key in obj) {
    const snakeKey = camelToSnake(key);
    converted[snakeKey] = convertKeysToSnake(obj[key]);
  }
  return converted;
};

// Helper function untuk convert object keys dari snake_case ke camelCase
export const convertKeysToCamel = (obj: any): any => {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamel);
  }
  
  // Handle non-objects (primitives)
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj;
  }
  
  // Handle objects - with error handling
  // Validate obj is iterable before using for...in
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  
  const converted: any = {};
  try {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    let keys: string[] = [];
    try {
      keys = Object.keys(obj);
    } catch {
      return obj;
    }
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key && obj.hasOwnProperty && typeof obj.hasOwnProperty === 'function' && obj.hasOwnProperty(key)) {
        const camelKey = snakeToCamel(key);
        let value = obj[key];
        
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
          try {
            value = JSON.parse(value);
          } catch {
            // Not JSON, keep as string
          }
        }
        
        converted[camelKey] = convertKeysToCamel(value);
      }
    }
  } catch {
    return obj;
  }
  
  return converted;
};

// Helper function untuk CRUD operations
const createCRUD = (tableName: string) => {
  // GET all
  app.get(`/api/${tableName}`, (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const offset = (page - 1) * limit;

      // Check if table exists
      const tableExists = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
      `).get(tableName);
      
      if (!tableExists) {
        return res.json({ 
          docs: [],
          totalDocs: 0,
          limit,
          totalPages: 0,
          page,
        });
      }

      const count = db.prepare(`SELECT COUNT(*) as total FROM ${tableName}`).get() as { total: number };
      const items = db.prepare(`SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);

      // Convert snake_case to camelCase
      const convertedItems = items.map(convertKeysToCamel);

      res.json({
        docs: convertedItems,
        totalDocs: count.total,
        limit,
        totalPages: Math.ceil(count.total / limit),
        page,
      });
    } catch (error: any) {
      res.json({ 
        docs: [],
        totalDocs: 0,
        limit: 10,
        totalPages: 0,
        page: 1,
      });
    }
  });

  // GET by ID
  app.get(`/api/${tableName}/:id`, (req, res) => {
    try {
      const item = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      if (item) {
        // Convert snake_case to camelCase
        res.json(convertKeysToCamel(item));
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Internal server error',
        error: error.toString(),
        table: tableName
      });
    }
  });

  // POST create
  app.post(`/api/${tableName}`, (req, res) => {
    try {
      // Convert camelCase to snake_case
      const data = convertKeysToSnake(req.body);
      let keys: string[] = [];
      try {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          keys = Object.keys(data).filter(k => data[k] !== undefined && k !== 'id' && k !== 'created_at' && k !== 'updated_at');
        } else {
          return res.status(400).json({ message: 'Invalid data format' });
        }
      } catch {
        return res.status(400).json({ message: 'Invalid data format' });
      }
      const values = keys.map(k => {
        // Handle nested objects (like file uploads) - convert to JSON string
        if (typeof data[k] === 'object' && data[k] !== null && !Array.isArray(data[k])) {
          return JSON.stringify(data[k]);
        }
        return data[k];
      });
      
      if (keys.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
      }
      
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${keys.join(', ')}, updated_at) VALUES (${placeholders}, CURRENT_TIMESTAMP)`;
      const result = db.prepare(sql).run(...values);
      
      const newItem = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(result.lastInsertRowid);
      // Convert snake_case to camelCase
      res.json(convertKeysToCamel(newItem));
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Internal server error',
        error: error.toString(),
        table: tableName
      });
    }
  });

  // PATCH update
  app.patch(`/api/${tableName}/:id`, (req, res) => {
    try {
      // Convert camelCase to snake_case
      const data = convertKeysToSnake(req.body);
      let keys: string[] = [];
      try {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          keys = Object.keys(data).filter(k => data[k] !== undefined && k !== 'id' && k !== 'created_at');
        } else {
          return res.status(400).json({ message: 'Invalid data format' });
        }
      } catch {
        return res.status(400).json({ message: 'Invalid data format' });
      }
      const values = keys.map(k => {
        // Handle nested objects (like file uploads) - convert to JSON string
        if (typeof data[k] === 'object' && data[k] !== null && !Array.isArray(data[k])) {
          return JSON.stringify(data[k]);
        }
        return data[k];
      });
      
      if (keys.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
      }
      
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const sql = `UPDATE ${tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      db.prepare(sql).run(...values, req.params.id);
      const updatedItem = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Not found' });
      }
      
      // Convert snake_case to camelCase
      res.json(convertKeysToCamel(updatedItem));
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Internal server error',
        error: error.toString(),
        table: tableName
      });
    }
  });

  // DELETE
  app.delete(`/api/${tableName}/:id`, (req, res) => {
    try {
      const result = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(req.params.id);
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'Deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Internal server error',
        error: error.toString(),
        table: tableName
      });
    }
  });
};

// Create CRUD endpoints for all tables
tables.forEach(table => createCRUD(table));

// Login endpoint
app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Simple password check (dalam production, gunakan bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Login berhasil'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Logout endpoint
app.post('/api/users/logout', (req, res) => {
  try {
    // In a real app, you might want to invalidate the token on the server
    // For now, we'll just return success and let the client clear localStorage
    res.json({
      message: 'Logout berhasil'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Define PORT early
const PORT = process.env.PORT || 3000;

// Media upload endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    cb(null, `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
      'image/bmp', 'image/svg+xml', 'image/tiff', 'image/x-icon',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream'
    ];
    
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, true);
    }
  }
});

app.post('/api/media', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    try {
      db.prepare('SELECT 1 FROM media LIMIT 1').get();
    } catch {
      initDatabase();
    }

    const filename = String(req.file.filename);
    const originalFilename = String(req.file.originalname);
    const mimeType = String(req.file.mimetype);
    const url = `http://localhost:${PORT}/uploads/${filename}`;
    const filesize = Number(req.file.size);
    const alt = req.body?.alt ? String(req.body.alt) : '';

    if (!filename || filename.trim() === '') {
      return res.status(400).json({ message: 'Filename tidak boleh kosong' });
    }

    const sql = `INSERT INTO media (filename, original_filename, mime_type, url, filesize, alt, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    const values = [filename, originalFilename, mimeType, url, filesize, alt];
    
    const result = db.prepare(sql).run(...values);
    
    if (!result || typeof result.lastInsertRowid === 'undefined' || result.lastInsertRowid === null) {
      return res.status(500).json({ message: 'Gagal menyimpan data' });
    }
    
    const newMedia: any = db.prepare('SELECT * FROM media WHERE id = ?').get(result.lastInsertRowid);
    
    if (!newMedia) {
      return res.status(500).json({ message: 'Gagal mengambil data yang diupload' });
    }
    
    const responseData = {
      id: newMedia.id,
      filename: newMedia.filename || '',
      originalFilename: newMedia.original_filename || '',
      mimeType: newMedia.mime_type || '',
      url: newMedia.url || '',
      filesize: newMedia.filesize || 0,
      alt: newMedia.alt || '',
      createdAt: newMedia.created_at || null,
      updatedAt: newMedia.updated_at || null,
    };
    
    return res.json(responseData);
  } catch (error: any) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File terlalu besar. Maksimal 50MB' });
    }
    return res.status(500).json({ 
      message: error.message || 'Terjadi kesalahan saat mengupload file' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server running',
    database: 'SQLite (database.db)',
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: ${join(__dirname, 'database.db')}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/media`);
  console.log(`   - GET  /api/:table`);
  console.log(`   - POST /api/:table`);
  console.log(`   - GET  /api/:table/:id`);
  console.log(`   - PUT  /api/:table/:id`);
  console.log(`   - DELETE /api/:table/:id`);
  console.log(`\n🚀 Server ready!\n`);
});

server.on('error', (err: any) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  }
  process.exit(1);
});

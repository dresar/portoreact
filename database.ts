import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to SQLite database
const dbPath = join(__dirname, 'database.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Helper function untuk menambahkan kolom jika belum ada
const addColumnIfNotExists = (tableName: string, columnName: string, columnDefinition: string) => {
  try {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  } catch (e: any) {
    // Column already exists, ignore
    if (!e.message.includes('duplicate column name')) {
      console.warn(`Warning adding column ${columnName} to ${tableName}:`, e.message);
    }
  }
};

// Initialize database tables
export const initDatabase = () => {

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      position TEXT,
      profession TEXT,
      email TEXT,
      phone TEXT,
      whatsapp TEXT,
      address TEXT,
      short_description TEXT,
      full_description TEXT,
      status TEXT DEFAULT 'available',
      github_url TEXT,
      linkedin_url TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      projects_completed INTEGER DEFAULT 0,
      years_experience INTEGER DEFAULT 0,
      special_courses INTEGER DEFAULT 0,
      satisfied_clients INTEGER DEFAULT 0,
      formal_photo TEXT,
      informal_photo TEXT,
      cv TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add missing columns if they don't exist (for existing databases)
  addColumnIfNotExists('profiles', 'formal_photo', 'TEXT');
  addColumnIfNotExists('profiles', 'informal_photo', 'TEXT');
  addColumnIfNotExists('profiles', 'cv', 'TEXT');

  // Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      excerpt TEXT,
      category_id INTEGER,
      featured_image TEXT,
      published_date DATETIME,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table - lengkap dengan semua field dari ProjectForm
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      short_description TEXT,
      content TEXT,
      category TEXT,
      status TEXT DEFAULT 'draft',
      featured INTEGER DEFAULT 0,
      featured_image TEXT,
      thumbnail TEXT,
      tech TEXT,
      tags TEXT,
      client_name TEXT,
      client_website TEXT,
      client_logo TEXT,
      team TEXT,
      start_date DATETIME,
      end_date DATETIME,
      launch_date DATETIME,
      live_url TEXT,
      github_url TEXT,
      demo_url TEXT,
      documentation_url TEXT,
      figma_url TEXT,
      budget REAL,
      duration TEXT,
      lines_of_code INTEGER,
      pages INTEGER,
      challenges TEXT,
      solutions TEXT,
      results TEXT,
      testimonials TEXT,
      related_projects TEXT,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      seo_meta_title TEXT,
      seo_meta_description TEXT,
      seo_meta_keywords TEXT,
      seo_og_image TEXT,
      images TEXT,
      videos TEXT,
      screenshots TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add missing columns for projects
  addColumnIfNotExists('projects', 'images', 'TEXT');
  addColumnIfNotExists('projects', 'videos', 'TEXT');
  addColumnIfNotExists('projects', 'screenshots', 'TEXT');

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      type TEXT DEFAULT 'all',
      description TEXT,
      slug TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Media table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_filename TEXT,
      mime_type TEXT,
      url TEXT,
      filesize INTEGER,
      alt TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Educations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS educations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field TEXT,
      start_date DATE,
      end_date DATE,
      description TEXT,
      gpa TEXT,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Skills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level TEXT DEFAULT 'intermediate',
      category TEXT,
      icon TEXT,
      years_experience INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Experiences table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      current INTEGER DEFAULT 0,
      description TEXT,
      responsibilities TEXT,
      technologies TEXT,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Certificates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date DATE,
      expiry_date DATE,
      credential_id TEXT,
      credential_url TEXT,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contacts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      phone TEXT,
      status TEXT DEFAULT 'new',
      replied_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      content TEXT,
      type TEXT DEFAULT 'Page Section',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Export list of all tables
export const tables = [
  'users',
  'profiles',
  'posts',
  'projects',
  'categories',
  'media',
  'educations',
  'skills',
  'experiences',
  'certificates',
  'contacts',
  'templates'
];


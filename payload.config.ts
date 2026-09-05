import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Portfolio Admin',
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'User', value: 'user' },
          ],
          defaultValue: 'user',
        },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'excerpt',
          type: 'textarea',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'publishedDate',
          type: 'date',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        },
      ],
    },
    {
      slug: 'projects',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'shortDescription',
          type: 'textarea',
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Web Development', value: 'web' },
            { label: 'Mobile App', value: 'mobile' },
            { label: 'Desktop App', value: 'desktop' },
            { label: 'Design', value: 'design' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'draft',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'url',
              type: 'text',
              label: 'Video URL (YouTube, Vimeo, etc)',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'screenshots',
          type: 'array',
          fields: [
            {
              name: 'screenshot',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'tech',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'version',
              type: 'text',
            },
            {
              name: 'icon',
              type: 'text',
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'client',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'team',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'role',
              type: 'text',
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'dates',
          type: 'group',
          fields: [
            {
              name: 'startDate',
              type: 'date',
            },
            {
              name: 'endDate',
              type: 'date',
            },
            {
              name: 'launchDate',
              type: 'date',
            },
          ],
        },
        {
          name: 'links',
          type: 'group',
          fields: [
            {
              name: 'live',
              type: 'text',
              label: 'Live URL',
            },
            {
              name: 'github',
              type: 'text',
              label: 'GitHub URL',
            },
            {
              name: 'demo',
              type: 'text',
              label: 'Demo URL',
            },
            {
              name: 'documentation',
              type: 'text',
            },
            {
              name: 'figma',
              type: 'text',
              label: 'Figma Design URL',
            },
          ],
        },
        {
          name: 'statistics',
          type: 'group',
          fields: [
            {
              name: 'budget',
              type: 'number',
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Duration (e.g., "3 months")',
            },
            {
              name: 'linesOfCode',
              type: 'number',
            },
            {
              name: 'pages',
              type: 'number',
            },
          ],
        },
        {
          name: 'challenges',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'solutions',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'results',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'testimonials',
          type: 'array',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'position',
              type: 'text',
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'relatedProjects',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
        },
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'likes',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'seo',
          type: 'group',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
            },
            {
              name: 'metaKeywords',
              type: 'text',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      slug: 'profiles',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
        },
        {
          name: 'profession',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'whatsapp',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'shortDescription',
          type: 'textarea',
        },
        {
          name: 'fullDescription',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Tersedia untuk Freelance', value: 'available' },
            { label: 'Tidak Tersedia', value: 'unavailable' },
            { label: 'Sibuk', value: 'busy' },
          ],
          defaultValue: 'available',
        },
        {
          name: 'githubUrl',
          type: 'text',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
        },
        {
          name: 'facebookUrl',
          type: 'text',
        },
        {
          name: 'instagramUrl',
          type: 'text',
        },
        {
          name: 'projectsCompleted',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'yearsExperience',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'specialCourses',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'satisfiedClients',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'formalPhoto',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'informalPhoto',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'cv',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Blog', value: 'blog' },
            { label: 'Project', value: 'project' },
            { label: 'Semua', value: 'all' },
          ],
          defaultValue: 'all',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
        },
      ],
    },
    {
      slug: 'media',
      upload: true,
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      slug: 'educations',
      admin: {
        useAsTitle: 'institution',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'institution',
          type: 'text',
          required: true,
        },
        {
          name: 'degree',
          type: 'text',
          required: true,
        },
        {
          name: 'field',
          type: 'text',
        },
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'gpa',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'skills',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Expert', value: 'expert' },
          ],
          defaultValue: 'intermediate',
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
            { label: 'Database', value: 'database' },
            { label: 'DevOps', value: 'devops' },
            { label: 'Design', value: 'design' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'yearsExperience',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      slug: 'experiences',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'current',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'responsibilities',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
            },
          ],
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'certificates',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'issuer',
          type: 'text',
          required: true,
        },
        {
          name: 'issueDate',
          type: 'date',
        },
        {
          name: 'expiryDate',
          type: 'date',
        },
        {
          name: 'credentialId',
          type: 'text',
        },
        {
          name: 'credentialUrl',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'contacts',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: ({ req }) => !!req.user,
        create: () => true, // Allow public to create contact messages
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'subject',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Read', value: 'read' },
            { label: 'Replied', value: 'replied' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'new',
        },
        {
          name: 'repliedAt',
          type: 'date',
        },
      ],
    },
    {
      slug: 'templates',
      admin: {
        useAsTitle: 'name',
      },
      access: {
        read: () => true,
        create: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
        delete: ({ req }) => !!req.user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Email', value: 'Email' },
            { label: 'Page Section', value: 'Page Section' },
            { label: 'Other', value: 'Other' },
          ],
          defaultValue: 'Page Section',
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-this',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI 
        ? (process.env.DATABASE_URI.startsWith('file:') 
            ? process.env.DATABASE_URI 
            : `file:${path.resolve(dirname, process.env.DATABASE_URI)}`)
        : `file:${path.resolve(dirname, 'payload.db')}`,
    },
    push: true, // Auto-migrate schema on startup
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
});


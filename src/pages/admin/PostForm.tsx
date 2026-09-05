import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useNotification } from '../../contexts/NotificationContext';

export const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    publishedDate: '',
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.docs || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const data = await api.getPost(id!);
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: typeof data.category === 'object' ? data.category?.id : data.category || '',
        status: data.status || 'draft',
        publishedDate: data.publishedDate || '',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
      };

      if (id) {
        await api.updatePost(id, submitData);
      } else {
        await api.createPost(submitData);
      }
      showNotification('Post berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=blog&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <AdminLayout title={id ? 'Edit Post' : 'Post Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
            }}
            required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-2">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900 mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Content (Rich Text) *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Tulis konten post di sini..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-900 mb-2">
            Published Date
          </label>
          <input
            type="date"
            id="publishedDate"
            value={formData.publishedDate}
            onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : id ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

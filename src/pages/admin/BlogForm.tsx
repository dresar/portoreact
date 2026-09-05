import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { Modal } from '../../components/admin/Modal';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { useNotification } from '../../contexts/NotificationContext';

export const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    category: '',
    tags: [] as string[],
    featuredImage: null as File | null,
    author: '',
    status: 'draft',
    publishedDate: '',
    readingTime: 0,
    views: 0,
    likes: 0,
    seoFocusKeyword: '',
    canonicalUrl: '',
    ogImage: null as File | null,
    allowComments: true,
  });
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string>('');
  const [currentOgImage, setCurrentOgImage] = useState<string>('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      // Filter categories untuk blog (type: 'blog' atau 'all')
      const blogCategories = (data.docs || []).filter(
        (cat: any) => cat.type === 'blog' || cat.type === 'all'
      );
      setCategories(blogCategories);
    } catch (error) {
      console.error('Gagal mengambil kategori:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const data = await api.getPost(id!);
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        category: typeof data.category === 'object' ? data.category?.id : data.category || '',
        tags: data.tags || [],
        author: data.author || '',
        status: data.status || 'draft',
        publishedDate: data.publishedDate || '',
        readingTime: data.readingTime || 0,
        views: data.views || 0,
        likes: data.likes || 0,
        seoFocusKeyword: data.seoFocusKeyword || '',
        canonicalUrl: data.canonicalUrl || '',
        featuredImage: null,
        ogImage: null,
        allowComments: data.allowComments !== undefined ? data.allowComments : true,
      });
      if (data.featuredImage?.url) setCurrentFeaturedImage(data.featuredImage.url);
      if (data.ogImage?.url) setCurrentOgImage(data.ogImage.url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data blog');
    }
  };

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                });
                resolve(webpFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.9
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (field: 'featuredImage' | 'ogImage', file: File | null) => {
    if (file) {
      const webpFile = await convertToWebP(file);
      setFormData({ ...formData, [field]: webpFile });
    } else {
      setFormData({ ...formData, [field]: null });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: any = {
        ...formData,
      };

      // Upload images
      if (formData.featuredImage) {
        const uploaded = await api.uploadMedia(formData.featuredImage);
        submitData.featuredImage = uploaded.id;
      }
      if (formData.ogImage) {
        const uploaded = await api.uploadMedia(formData.ogImage);
        submitData.ogImage = uploaded.id;
      }

      delete submitData.featuredImage;
      delete submitData.ogImage;

      if (id) {
        await api.updatePost(id, submitData);
      } else {
        await api.createPost(submitData);
      }
      showNotification('Blog berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=blog&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan blog');
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
    <AdminLayout title={id ? 'Edit Blog' : 'Blog Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
              }}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content (Rich Text) *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Tulis konten blog di sini..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Kategori
            </label>
            <div className="flex gap-2">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors whitespace-nowrap"
              >
                + Tambah Kategori
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Diterbitkan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Terbit
            </label>
            <input
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Waktu Baca (menit)
            </label>
            <input
              type="number"
              value={formData.readingTime}
              onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tag
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tambah tag"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gambar Utama
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('featuredImage', e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
            />
            {currentFeaturedImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-900 mb-2">Gambar saat ini:</p>
                <img src={currentFeaturedImage} alt="Featured" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gambar OG
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('ogImage', e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
            />
            {currentOgImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-900 mb-2">Gambar saat ini:</p>
                <img src={currentOgImage} alt="OG" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Judul Meta
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Deskripsi Meta
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Kata Kunci Meta
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Kata Kunci Fokus SEO
                </label>
                <input
                  type="text"
                  value={formData.seoFocusKeyword}
                  onChange={(e) => setFormData({ ...formData, seoFocusKeyword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  URL Kanonik
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowComments}
                onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Izinkan Komentar</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : id ? 'Update Blog' : 'Buat Blog'}
          </button>
        </div>
      </form>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Tambah Kategori Baru"
        size="md"
      >
        <CategoryForm
          type="blog"
          onSuccess={() => {
            setIsCategoryModalOpen(false);
            fetchCategories();
          }}
          onCancel={() => setIsCategoryModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};


import { useState } from 'react';
import { api } from '../../services/api';

interface CategoryFormProps {
  category?: { id: string; name: string; type?: string; description?: string; slug?: string };
  type?: 'blog' | 'project' | 'all';
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoryForm = ({ category, type = 'all', onSuccess, onCancel }: CategoryFormProps) => {
  const [name, setName] = useState(category?.name || '');
  const [categoryType, setCategoryType] = useState(category?.type || type);
  const [description, setDescription] = useState(category?.description || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: any = {
        name,
        type: categoryType,
        description,
        slug: slug || generateSlug(name),
      };
      
      if (category) {
        await api.updateCategory(category.id, data);
      } else {
        await api.createCategory(data);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
          Nama Kategori *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!category && !slug) {
              setSlug(generateSlug(e.target.value));
            }
          }}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan nama kategori"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-2">
          Tipe Kategori
        </label>
        <select
          id="type"
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Semua</option>
          <option value="blog">Blog</option>
          <option value="project">Project</option>
        </select>
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-2">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="slug-kategori"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
          Deskripsi
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Masukkan deskripsi kategori (opsional)"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : category ? 'Update' : 'Buat'}
        </button>
      </div>
    </form>
  );
};


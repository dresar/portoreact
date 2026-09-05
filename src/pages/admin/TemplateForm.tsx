import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useNotification } from '../../contexts/NotificationContext';

export const TemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    type: 'Page Section',
  });

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const data = await api.getItem('templates', id!);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        content: data.content || '',
        type: data.type || 'Page Section',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data template');
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
        await api.updateItem('templates', id, submitData);
      } else {
        await api.createItem('templates', submitData);
      }
      showNotification('Template berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=templates&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Template' : 'Template Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Email">Email</option>
            <option value="Page Section">Page Section</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Content (Rich Text) *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Tulis konten template di sini..."
          />
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t">
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
            {loading ? 'Menyimpan...' : id ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};


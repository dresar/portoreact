import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

export const ContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'new',
  });

  useEffect(() => {
    if (id) {
      fetchContact();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      const data = await api.getItem('contacts', id!);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message || '',
        status: data.status || 'new',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data kontak');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = { ...formData };

      if (id) {
        await api.updateItem('contacts', id, submitData);
      } else {
        await api.createItem('contacts', submitData);
      }
      
      showNotification('Kontak berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=contact&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kontak');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Kontak' : 'Kontak Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nama *
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
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Telepon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              <option value="new">Baru</option>
              <option value="read">Dibaca</option>
              <option value="replied">Dibalas</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subjek *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Pesan *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
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
            {loading ? 'Menyimpan...' : id ? 'Perbarui' : 'Buat'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};


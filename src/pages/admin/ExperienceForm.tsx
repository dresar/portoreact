import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useNotification } from '../../contexts/NotificationContext';

export const ExperienceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    type: 'Full-time',
  });

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      const data = await api.getItem('experiences', id!);
      setFormData({
        title: data.title || '',
        company: data.company || '',
        location: data.location || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        description: data.description || '',
        type: data.type || 'Full-time',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data experience');
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
        await api.updateItem('experiences', id, submitData);
      } else {
        await api.createItem('experiences', submitData);
      }
      showNotification('Experience berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=experience&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Pengalaman' : 'Pengalaman Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Jabatan *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Contoh: Full Stack Developer, Product Manager"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Perusahaan *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              placeholder="Nama perusahaan"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Lokasi
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Contoh: Jakarta, Remote"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Mulai *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tipe
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Magang</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Deskripsi (Rich Text) *
          </label>
          <RichTextEditor
            content={formData.description}
            onChange={(description) => setFormData({ ...formData, description })}
            placeholder="Tulis deskripsi pengalaman kerja di sini..."
          />
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
            {loading ? 'Menyimpan...' : id ? 'Perbarui Pengalaman' : 'Buat Pengalaman'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};


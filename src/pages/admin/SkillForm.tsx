import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

export const SkillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    level: 'intermediate',
    category: '',
    icon: '',
    yearsExperience: 0,
  });

  useEffect(() => {
    if (id) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      const data = await api.getCollection('skills', { where: { id: { equals: id } } });
      if (data.docs && data.docs.length > 0) {
        const skill = data.docs[0];
        setFormData({
          name: skill.name || '',
          level: skill.level || 'intermediate',
          category: skill.category || '',
          icon: skill.icon || '',
          yearsExperience: skill.yearsExperience || 0,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data keahlian');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await api.updateItem('skills', id, formData);
      } else {
        await api.createItem('skills', formData);
      }
      
      showNotification('Keahlian berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=skills&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan keahlian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Keahlian' : 'Keahlian Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nama Keahlian *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Contoh: React, Node.js, Python"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tingkat
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Pemula</option>
              <option value="intermediate">Menengah</option>
              <option value="advanced">Lanjutan</option>
              <option value="expert">Ahli</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih kategori</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
              <option value="design">Design</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tahun Pengalaman
            </label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ikon (Emoji atau Teks)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Contoh: 💻 atau React"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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


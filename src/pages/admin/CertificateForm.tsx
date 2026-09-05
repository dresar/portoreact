import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

export const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    image: null as File | null,
  });
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const data = await api.getItem('certificates', id!);
      setFormData({
        name: data.name || '',
        issuer: data.issuer || '',
        issueDate: data.issueDate || data.issue_date || '',
        expiryDate: data.expiryDate || data.expiry_date || '',
        credentialId: data.credentialId || data.credential_id || '',
        credentialUrl: data.credentialUrl || data.credential_url || '',
        description: data.description || '',
        image: null,
      });
      if (data.image?.url) setCurrentImage(data.image.url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data sertifikat');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: any = { ...formData };

      // Upload image if new file selected
      if (formData.image) {
        const uploaded = await api.uploadMedia(formData.image);
        submitData.image = uploaded.id;
      }

      delete submitData.image;

      if (id) {
        await api.updateItem('certificates', id, submitData);
      } else {
        await api.createItem('certificates', submitData);
      }
      
      showNotification('Sertifikat berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=certificates&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan sertifikat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Sertifikat' : 'Sertifikat Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nama Sertifikat *
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
              Penerbit *
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Diterbitkan
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Kadaluarsa
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ID Kredensial
            </label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              URL Kredensial
            </label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gambar Sertifikat
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
            />
            {currentImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-900 mb-2">Gambar saat ini:</p>
                <img src={currentImage} alt="Certificate" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
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


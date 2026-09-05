import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

export const EducationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    gpa: '',
    logo: null as File | null,
  });
  const [currentLogo, setCurrentLogo] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchEducation();
    }
  }, [id]);

  const fetchEducation = async () => {
    try {
      const data = await api.getCollection('educations', { where: { id: { equals: id } } });
      if (data.docs && data.docs.length > 0) {
        const edu = data.docs[0];
        setFormData({
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || '',
          gpa: edu.gpa || '',
          logo: null,
        });
        if (edu.logo?.url) setCurrentLogo(edu.logo.url);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data pendidikan');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: any = { ...formData };
      
      if (formData.logo) {
        const webpFile = await convertToWebP(formData.logo);
        const uploaded = await api.uploadMedia(webpFile);
        submitData.logo = uploaded.id;
      }

      delete submitData.logo;

      if (id) {
        await api.updateItem('educations', id, submitData);
      } else {
        await api.createItem('educations', submitData);
      }
      
      showNotification('Pendidikan berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=education&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pendidikan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Pendidikan' : 'Pendidikan Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Institusi *
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
              placeholder="Contoh: Universitas Indonesia"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gelar *
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
              placeholder="Contoh: Sarjana, Diploma, Sertifikat"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bidang Studi
            </label>
            <input
              type="text"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              placeholder="Contoh: Teknik Informatika, Manajemen"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              IPK / Nilai
            </label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="Contoh: 3.8/4.0 atau 90/100"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              placeholder="Tulis deskripsi tentang pendidikan Anda di sini..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Logo Institusi
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...formData, logo: file });
                }
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
            />
            {currentLogo && (
              <div className="mt-2">
                <p className="text-xs text-gray-900 mb-2">Logo saat ini:</p>
                <img src={currentLogo} alt="Logo" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
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


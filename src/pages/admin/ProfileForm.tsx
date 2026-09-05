import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useNotification } from '../../contexts/NotificationContext';

export const ProfileForm = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    profession: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    shortDescription: '',
    fullDescription: '',
    status: 'available',
    githubUrl: '',
    linkedinUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    projectsCompleted: 0,
    yearsExperience: 0,
    specialCourses: 0,
    satisfiedClients: 0,
    formalPhoto: null as File | null,
    informalPhoto: null as File | null,
    cv: null as File | null,
  });
  const [currentFormalPhoto, setCurrentFormalPhoto] = useState<string>('');
  const [currentInformalPhoto, setCurrentInformalPhoto] = useState<string>('');
  const [currentCv, setCurrentCv] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  // Reload profile data when component mounts or when returning from save
  useEffect(() => {
    const handleFocus = () => {
      fetchProfile();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getCollection('profiles', { limit: 1 });
      if (data.docs && data.docs.length > 0) {
        const profile = data.docs[0];
        // Use functional update to preserve existing formData
        setFormData((prev) => ({
          ...prev,
          name: profile.name || '',
          position: profile.position || '',
          profession: profile.profession || '',
          email: profile.email || '',
          phone: profile.phone || '',
          whatsapp: profile.whatsapp || '',
          address: profile.address || '',
          shortDescription: profile.shortDescription || '',
          fullDescription: profile.fullDescription || '',
          status: profile.status || 'available',
          githubUrl: profile.githubUrl || '',
          linkedinUrl: profile.linkedinUrl || '',
          facebookUrl: profile.facebookUrl || '',
          instagramUrl: profile.instagramUrl || '',
          projectsCompleted: profile.projectsCompleted || 0,
          yearsExperience: profile.yearsExperience || 0,
          specialCourses: profile.specialCourses || 0,
          satisfiedClients: profile.satisfiedClients || 0,
          // Preserve file inputs (don't reset them)
          formalPhoto: prev.formalPhoto,
          informalPhoto: prev.informalPhoto,
          cv: prev.cv,
        }));
        if (profile.formalPhoto?.url) setCurrentFormalPhoto(profile.formalPhoto.url);
        if (profile.informalPhoto?.url) setCurrentInformalPhoto(profile.informalPhoto.url);
        if (profile.cv?.url) setCurrentCv(profile.cv.url);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
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

  const handleFileChange = async (field: 'formalPhoto' | 'informalPhoto' | 'cv', file: File | null) => {
    if (file) {
      if (field === 'cv') {
        setFormData({ ...formData, [field]: file });
      } else {
        const webpFile = await convertToWebP(file);
        setFormData({ ...formData, [field]: webpFile });
      }
    } else {
      setFormData({ ...formData, [field]: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hanya kirim field yang ada nilainya atau field required
      const submitData: any = {};
      
      // Field required - wajib ada
      if (!formData.name || !formData.name.trim()) {
        setError('Nama wajib diisi');
        setLoading(false);
        return;
      }
      submitData.name = formData.name.trim();
      
      if (!formData.email || !formData.email.trim()) {
        setError('Email wajib diisi');
        setLoading(false);
        return;
      }
      submitData.email = formData.email.trim();
      
      // Field optional - hanya kirim jika ada nilai
      if (formData.position && formData.position.trim()) submitData.position = formData.position.trim();
      if (formData.profession && formData.profession.trim()) submitData.profession = formData.profession.trim();
      if (formData.phone && formData.phone.trim()) submitData.phone = formData.phone.trim();
      if (formData.whatsapp && formData.whatsapp.trim()) submitData.whatsapp = formData.whatsapp.trim();
      if (formData.address && formData.address.trim()) submitData.address = formData.address.trim();
      if (formData.shortDescription && formData.shortDescription.trim()) submitData.shortDescription = formData.shortDescription.trim();
      if (formData.fullDescription && formData.fullDescription.trim()) submitData.fullDescription = formData.fullDescription.trim();
      if (formData.status) submitData.status = formData.status;
      if (formData.githubUrl && formData.githubUrl.trim()) submitData.githubUrl = formData.githubUrl.trim();
      if (formData.linkedinUrl && formData.linkedinUrl.trim()) submitData.linkedinUrl = formData.linkedinUrl.trim();
      if (formData.facebookUrl && formData.facebookUrl.trim()) submitData.facebookUrl = formData.facebookUrl.trim();
      if (formData.instagramUrl && formData.instagramUrl.trim()) submitData.instagramUrl = formData.instagramUrl.trim();
      
      // Statistik - selalu kirim (default 0)
      submitData.projectsCompleted = formData.projectsCompleted || 0;
      submitData.yearsExperience = formData.yearsExperience || 0;
      submitData.specialCourses = formData.specialCourses || 0;
      submitData.satisfiedClients = formData.satisfiedClients || 0;
      
      // Upload files hanya jika ada
      if (formData.formalPhoto) {
        try {
          const uploaded = await api.uploadMedia(formData.formalPhoto);
          submitData.formalPhoto = {
            id: uploaded.id,
            url: uploaded.url,
            filename: uploaded.filename,
          };
        } catch (uploadError: any) {
          throw new Error(`Gagal upload foto formal: ${uploadError.message}`);
        }
      }
      if (formData.informalPhoto) {
        try {
          const uploaded = await api.uploadMedia(formData.informalPhoto);
          submitData.informalPhoto = {
            id: uploaded.id,
            url: uploaded.url,
            filename: uploaded.filename,
          };
        } catch (uploadError: any) {
          throw new Error(`Gagal upload foto informal: ${uploadError.message}`);
        }
      }
      if (formData.cv) {
        try {
          const uploaded = await api.uploadMedia(formData.cv);
          submitData.cv = {
            id: uploaded.id,
            url: uploaded.url,
            filename: uploaded.filename,
          };
        } catch (uploadError: any) {
          throw new Error(`Gagal upload CV: ${uploadError.message}`);
        }
      }

      const data = await api.getCollection('profiles', { limit: 1 });
      if (data.docs && data.docs.length > 0) {
        await api.updateItem('profiles', data.docs[0].id, submitData);
      } else {
        await api.createItem('profiles', submitData);
      }
      
      showNotification('Profile berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=profile&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit Profil">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                👤 Nama *
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
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                👤 Seorang Apa
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="Web Development, UI UX"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-900 mt-1">Pisahkan dengan koma untuk multiple profesi</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                ✉️ Email *
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
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📍 Alamat
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📷 Foto Formal (Hero Section)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('formalPhoto', e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
              {currentFormalPhoto && (
                <div className="mt-2">
                  <p className="text-xs text-gray-900 mb-2">Foto saat ini:</p>
                  <img src={currentFormalPhoto} alt="Formal" className="w-24 h-24 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📋 Deskripsi Singkat (Home)
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={3}
                placeholder="Selamat datang di portofolio saya."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📝 Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="available">Tersedia untuk Freelance</option>
                <option value="unavailable">Tidak Tersedia</option>
                <option value="busy">Sibuk</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                💼 Jabatan
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📞 Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                💬 WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📷 Foto Non-Formal (About Me)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('informalPhoto', e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
              {currentInformalPhoto && (
                <div className="mt-2">
                  <p className="text-xs text-gray-900 mb-2">Foto about saat ini:</p>
                  <img src={currentInformalPhoto} alt="Informal" className="w-24 h-24 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            📝 Deskripsi Lengkap (About Section)
          </h3>
          <RichTextEditor
            content={formData.fullDescription || ''}
            onChange={(content) => {
              // Only update fullDescription, preserve all other formData
              setFormData((prev) => ({ ...prev, fullDescription: content }));
            }}
            placeholder="Tulis deskripsi lengkap tentang Anda di sini..."
          />
        </div>

        {/* Social Media Links */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            🔗 Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Achievement Statistics */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            📊 Statistik Pencapaian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                ✅ Project Selesai
              </label>
              <input
                type="number"
                value={formData.projectsCompleted}
                onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                📅 Tahun Pengalaman
              </label>
              <input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                🎓 Kursus Khusus
              </label>
              <input
                type="number"
                value={formData.specialCourses}
                onChange={(e) => setFormData({ ...formData, specialCourses: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                😊 Klien Puas
              </label>
              <input
                type="number"
                value={formData.satisfiedClients}
                onChange={(e) => setFormData({ ...formData, satisfiedClients: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* CV/Resume */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            📄 CV/Resume (PDF)
          </h3>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange('cv', e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 mb-2"
          />
          {currentCv && (
            <div className="mt-2">
              <p className="text-xs text-gray-900 mb-2">CV saat ini:</p>
              <a
                href={currentCv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                📄 Lihat CV
              </a>
            </div>
          )}
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
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};


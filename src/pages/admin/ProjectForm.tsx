import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { Modal } from '../../components/admin/Modal';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { useNotification } from '../../contexts/NotificationContext';

export const ProjectForm = () => {
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
    description: '',
    shortDescription: '',
    content: '',
    category: '' as string | { id: string },
    status: 'draft',
    featured: false,
    featuredImage: null as File | null,
    thumbnail: null as File | null,
    images: [] as File[],
    videos: [] as Array<{ video: File | null; url: string; caption: string }>,
    screenshots: [] as File[],
    tech: [] as Array<{ name: string; version: string; icon: string }>,
    tags: [] as string[],
    client: {
      name: '',
      website: '',
      logo: null as File | null,
    },
    team: [] as Array<{ name: string; role: string; avatar: File | null }>,
    dates: {
      startDate: '',
      endDate: '',
      launchDate: '',
    },
    links: {
      live: '',
      github: '',
      demo: '',
      documentation: '',
      figma: '',
    },
    statistics: {
      budget: 0,
      duration: '',
      linesOfCode: 0,
      pages: 0,
    },
    challenges: '',
    solutions: '',
    results: '',
    testimonials: [] as Array<{ quote: string; author: string; position: string; avatar: File | null }>,
    relatedProjects: [] as string[],
    views: 0,
    likes: 0,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogImage: null as File | null,
    },
  });

  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string>('');
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentScreenshots, setCurrentScreenshots] = useState<string[]>([]);
  const [currentClientLogo, setCurrentClientLogo] = useState<string>('');
  const [currentOgImage, setCurrentOgImage] = useState<string>('');
  const [techInput, setTechInput] = useState({ name: '', version: '', icon: '' });
  const [tagInput, setTagInput] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProjects();
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      // Filter categories untuk project (type: 'project' atau 'all')
      const projectCategories = (data.docs || []).filter(
        (cat: any) => cat.type === 'project' || cat.type === 'all'
      );
      setCategories(projectCategories);
    } catch (error) {
      console.error('Gagal mengambil kategori:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data.docs || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchProject = async () => {
    try {
      const data = await api.getProject(id!);
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        content: data.content || '',
        category: data.category || '',
        status: data.status || 'draft',
        featured: data.featured || false,
        featuredImage: null,
        thumbnail: null,
        images: [],
        videos: data.videos || [],
        screenshots: [],
        tech: data.tech || [],
        tags: data.tags?.map((t: any) => t.tag || t) || [],
        client: data.client || { name: '', website: '', logo: null },
        team: data.team || [],
        dates: data.dates || { startDate: '', endDate: '', launchDate: '' },
        links: data.links || { live: '', github: '', demo: '', documentation: '', figma: '' },
        statistics: data.statistics || { budget: 0, duration: '', linesOfCode: 0, pages: 0 },
        challenges: data.challenges || '',
        solutions: data.solutions || '',
        results: data.results || '',
        testimonials: data.testimonials || [],
        relatedProjects: data.relatedProjects?.map((p: any) => typeof p === 'object' ? p.id : p) || [],
        views: data.views || 0,
        likes: data.likes || 0,
        seo: data.seo || { metaTitle: '', metaDescription: '', metaKeywords: '', ogImage: null },
      });
      if (data.featuredImage?.url) setCurrentFeaturedImage(data.featuredImage.url);
      if (data.thumbnail?.url) setCurrentThumbnail(data.thumbnail.url);
      if (data.client?.logo?.url) setCurrentClientLogo(data.client.logo.url);
      if (data.seo?.ogImage?.url) setCurrentOgImage(data.seo.ogImage.url);
      if (data.images && Array.isArray(data.images)) {
        const imageUrls = data.images
          .map((img: any) => img.image?.url || img.url || null)
          .filter(Boolean);
        setCurrentImages(imageUrls);
      }
      if (data.screenshots && Array.isArray(data.screenshots)) {
        const screenshotUrls = data.screenshots
          .map((s: any) => s.screenshot?.url || s.url || null)
          .filter(Boolean);
        setCurrentScreenshots(screenshotUrls);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data project');
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

  const handleFileChange = async (field: 'featuredImage' | 'thumbnail' | 'client.logo' | 'seo.ogImage', file: File | null) => {
    if (file) {
      const webpFile = await convertToWebP(file);
      if (field === 'featuredImage') {
        setFormData({ ...formData, featuredImage: webpFile });
      } else if (field === 'thumbnail') {
        setFormData({ ...formData, thumbnail: webpFile });
      } else if (field === 'client.logo') {
        setFormData({ ...formData, client: { ...formData.client, logo: webpFile } });
      } else if (field === 'seo.ogImage') {
        setFormData({ ...formData, seo: { ...formData.seo, ogImage: webpFile } });
      }
    } else {
      if (field === 'featuredImage') {
        setFormData({ ...formData, featuredImage: null });
      } else if (field === 'thumbnail') {
        setFormData({ ...formData, thumbnail: null });
      } else if (field === 'client.logo') {
        setFormData({ ...formData, client: { ...formData.client, logo: null } });
      } else if (field === 'seo.ogImage') {
        setFormData({ ...formData, seo: { ...formData.seo, ogImage: null } });
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const webpFiles = await Promise.all(files.map(convertToWebP));
      setFormData({
        ...formData,
        images: [...formData.images, ...webpFiles],
      });
    }
  };

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const webpFiles = await Promise.all(files.map(convertToWebP));
      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, ...webpFiles],
      });
    }
  };

  const handleVideoChange = (index: number, field: 'video' | 'url' | 'caption', value: File | string | null) => {
    const newVideos = [...formData.videos];
    if (field === 'video') {
      newVideos[index] = { ...newVideos[index], video: value as File | null };
    } else {
      newVideos[index] = { ...newVideos[index], [field]: value };
    }
    setFormData({ ...formData, videos: newVideos });
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, { video: null, url: '', caption: '' }],
    });
  };

  const removeVideo = (index: number) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeScreenshot = (index: number) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter((_, i) => i !== index),
    });
  };

  const removeCurrentImage = (index: number) => {
    setCurrentImages(currentImages.filter((_, i) => i !== index));
  };

  const removeCurrentScreenshot = (index: number) => {
    setCurrentScreenshots(currentScreenshots.filter((_, i) => i !== index));
  };

  const addTech = () => {
    if (techInput.name.trim()) {
      setFormData({
        ...formData,
        tech: [...formData.tech, { ...techInput }],
      });
      setTechInput({ name: '', version: '', icon: '' });
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter((_, i) => i !== index),
    });
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

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...formData.team, { name: '', role: '', avatar: null }],
    });
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      team: formData.team.filter((_, i) => i !== index),
    });
  };

  const updateTeamMember = (index: number, field: string, value: string | File | null) => {
    const newTeam = [...formData.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setFormData({ ...formData, team: newTeam });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { quote: '', author: '', position: '', avatar: null }],
    });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index),
    });
  };

  const updateTestimonial = (index: number, field: string, value: string | File | null) => {
    const newTestimonials = [...formData.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setFormData({ ...formData, testimonials: newTestimonials });
  };

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
      const submitData: any = {
        ...formData,
      };

      // Upload featured image
      if (formData.featuredImage) {
        const uploaded = await api.uploadMedia(formData.featuredImage);
        submitData.featuredImage = uploaded.id;
      }

      // Upload thumbnail
      if (formData.thumbnail) {
        const uploaded = await api.uploadMedia(formData.thumbnail);
        submitData.thumbnail = uploaded.id;
      }

      // Upload client logo
      if (formData.client.logo) {
        const uploaded = await api.uploadMedia(formData.client.logo);
        submitData.client = { ...submitData.client, logo: uploaded.id };
      }

      // Upload OG image
      if (formData.seo.ogImage) {
        const uploaded = await api.uploadMedia(formData.seo.ogImage);
        submitData.seo = { ...submitData.seo, ogImage: uploaded.id };
      }

      // Upload images
      const uploadedImageIds: any[] = [];
      for (const image of formData.images) {
        const uploaded = await api.uploadMedia(image);
        uploadedImageIds.push({ image: uploaded.id });
      }

      // Upload screenshots
      const uploadedScreenshotIds: any[] = [];
      for (const screenshot of formData.screenshots) {
        const uploaded = await api.uploadMedia(screenshot);
        uploadedScreenshotIds.push({ screenshot: uploaded.id });
      }

      // Upload videos
      const uploadedVideoIds: any[] = [];
      for (const video of formData.videos) {
        if (video.video) {
          const uploaded = await api.uploadMedia(video.video);
          uploadedVideoIds.push({ video: uploaded.id, url: video.url, caption: video.caption });
        } else if (video.url) {
          uploadedVideoIds.push({ video: null, url: video.url, caption: video.caption });
        }
      }

      // Upload team avatars
      for (let i = 0; i < formData.team.length; i++) {
        if (formData.team[i].avatar) {
          const uploaded = await api.uploadMedia(formData.team[i].avatar!);
          submitData.team[i].avatar = uploaded.id;
        }
      }

      // Upload testimonial avatars
      for (let i = 0; i < formData.testimonials.length; i++) {
        if (formData.testimonials[i].avatar) {
          const uploaded = await api.uploadMedia(formData.testimonials[i].avatar!);
          submitData.testimonials[i].avatar = uploaded.id;
        }
      }

      // Combine current and new images
      const currentImageObjects = currentImages.map((url) => ({ image: { url } }));
      if (uploadedImageIds.length > 0 || currentImageObjects.length > 0) {
        submitData.images = [...currentImageObjects, ...uploadedImageIds];
      }

      // Combine current and new screenshots
      const currentScreenshotObjects = currentScreenshots.map((url) => ({ screenshot: { url } }));
      if (uploadedScreenshotIds.length > 0 || currentScreenshotObjects.length > 0) {
        submitData.screenshots = [...currentScreenshotObjects, ...uploadedScreenshotIds];
      }

      // Set videos
      if (uploadedVideoIds.length > 0) {
        submitData.videos = uploadedVideoIds;
      }

      // Clean up file fields
      delete submitData.featuredImage;
      delete submitData.thumbnail;
      delete submitData.images;
      delete submitData.screenshots;
      delete submitData.videos;

      if (id) {
        await api.updateProject(id, submitData);
      } else {
        await api.createProject(submitData);
      }
      showNotification('Project berhasil disimpan!', 'success');
      // Add timestamp to force refresh
      navigate(`/admin?tab=projects&refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Proyek' : 'Proyek Baru'}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Judul *
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
                Kategori
              </label>
              <div className="flex gap-2">
                <select
                  value={typeof formData.category === 'object' ? formData.category?.id : formData.category || ''}
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
                <option value="archived">Diarsipkan</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Deskripsi Singkat
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Konten (Rich Text) *
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Tulis konten project di sini..."
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Media</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <img src={currentFeaturedImage} alt="Featured" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('thumbnail', e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
              {currentThumbnail && (
                <div className="mt-2">
                  <img src={currentThumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Gambar Project (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 mb-4"
              />
              
              {currentImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-900 mb-2">Gambar saat ini:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Current ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeCurrentImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-900 mb-2">Gambar baru:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Screenshot (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 mb-4"
              />
              
              {currentScreenshots.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-900 mb-2">Screenshots saat ini:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentScreenshots.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeCurrentScreenshot(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.screenshots.length > 0 && (
                <div>
                  <p className="text-sm text-gray-900 mb-2">Screenshots baru:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(screenshot)}
                          alt={`New Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Video
              </label>
              <button
                type="button"
                onClick={addVideo}
                className="mb-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                + Tambah Video
              </button>
              {formData.videos.map((video, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Video {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleVideoChange(index, 'video', file);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                    <input
                      type="url"
                      placeholder="Atau masukkan URL video (YouTube, Vimeo, dll)"
                      value={video.url}
                      onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Keterangan"
                      value={video.caption}
                      onChange={(e) => handleVideoChange(index, 'caption', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack & Tags */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Stack & Tag</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Tech Stack</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={techInput.name}
                  onChange={(e) => setTechInput({ ...techInput, name: e.target.value })}
                  placeholder="Nama teknologi"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
                <input
                  type="text"
                  value={techInput.version}
                  onChange={(e) => setTechInput({ ...techInput, version: e.target.value })}
                  placeholder="Versi (opsional)"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput.icon}
                    onChange={(e) => setTechInput({ ...techInput, icon: e.target.value })}
                    placeholder="Icon (opsional)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2"
                  >
                    {tech.name} {tech.version && `(${tech.version})`}
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Tag</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Tambah tag"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
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
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2"
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
          </div>
        </div>

        {/* Client Information */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Klien</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nama Klien
              </label>
              <input
                type="text"
                value={formData.client.name}
                onChange={(e) => setFormData({ ...formData, client: { ...formData.client, name: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Website Klien
              </label>
              <input
                type="url"
                value={formData.client.website}
                onChange={(e) => setFormData({ ...formData, client: { ...formData.client, website: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Logo Klien
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('client.logo', e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
              {currentClientLogo && (
                <div className="mt-2">
                  <img src={currentClientLogo} alt="Client Logo" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Anggota Tim</h2>
          <button
            type="button"
            onClick={addTeamMember}
            className="mb-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            + Tambah Anggota Tim
          </button>
          {formData.team.map((member, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Anggota {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nama"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Peran"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          updateTeamMember(index, 'avatar', file);
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                    />
                  </div>
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tanggal Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={formData.dates.startDate}
                onChange={(e) => setFormData({ ...formData, dates: { ...formData.dates, startDate: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={formData.dates.endDate}
                onChange={(e) => setFormData({ ...formData, dates: { ...formData.dates, endDate: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tanggal Launch
              </label>
              <input
                type="date"
                value={formData.dates.launchDate}
                onChange={(e) => setFormData({ ...formData, dates: { ...formData.dates, launchDate: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tautan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Live
              </label>
              <input
                type="url"
                value={formData.links.live}
                onChange={(e) => setFormData({ ...formData, links: { ...formData.links, live: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL GitHub
              </label>
              <input
                type="url"
                value={formData.links.github}
                onChange={(e) => setFormData({ ...formData, links: { ...formData.links, github: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Demo
              </label>
              <input
                type="url"
                value={formData.links.demo}
                onChange={(e) => setFormData({ ...formData, links: { ...formData.links, demo: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Dokumentasi
              </label>
              <input
                type="url"
                value={formData.links.documentation}
                onChange={(e) => setFormData({ ...formData, links: { ...formData.links, documentation: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Desain Figma
              </label>
              <input
                type="url"
                value={formData.links.figma}
                onChange={(e) => setFormData({ ...formData, links: { ...formData.links, figma: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Anggaran
              </label>
              <input
                type="number"
                value={formData.statistics.budget}
                onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, budget: parseFloat(e.target.value) || 0 } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Durasi
              </label>
              <input
                type="text"
                value={formData.statistics.duration}
                onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, duration: e.target.value } })}
                placeholder="contoh: 3 bulan"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Baris Kode
              </label>
              <input
                type="number"
                value={formData.statistics.linesOfCode}
                onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, linesOfCode: parseInt(e.target.value) || 0 } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Halaman
              </label>
              <input
                type="number"
                value={formData.statistics.pages}
                onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, pages: parseInt(e.target.value) || 0 } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Challenges, Solutions, Results */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Project</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tantangan (Rich Text)
              </label>
              <RichTextEditor
                content={formData.challenges}
                onChange={(challenges) => setFormData({ ...formData, challenges })}
                placeholder="Tulis tantangan project di sini..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Solusi (Rich Text)
              </label>
              <RichTextEditor
                content={formData.solutions}
                onChange={(solutions) => setFormData({ ...formData, solutions })}
                placeholder="Tulis solusi yang diterapkan di sini..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hasil (Rich Text)
              </label>
              <RichTextEditor
                content={formData.results}
                onChange={(results) => setFormData({ ...formData, results })}
                placeholder="Tulis hasil project di sini..."
              />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Testimoni</h2>
          <button
            type="button"
            onClick={addTestimonial}
            className="mb-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            + Tambah Testimoni
          </button>
          {formData.testimonials.map((testimonial, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">Testimoni {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-2">
                    <textarea
                      placeholder="Kutipan"
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 resize-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Penulis"
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                      <input
                        type="text"
                        placeholder="Posisi"
                        value={testimonial.position}
                        onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateTestimonial(index, 'avatar', e.target.files?.[0] || null)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>
            </div>
          ))}
        </div>

        {/* Related Projects */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Project Terkait</h2>
          <select
            multiple
            value={formData.relatedProjects}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, relatedProjects: selected });
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 min-h-[150px]"
          >
            {projects.filter(p => p.id !== id).map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">Tahan Ctrl/Cmd untuk memilih beberapa project</p>
        </div>

        {/* SEO */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Judul Meta
              </label>
              <input
                type="text"
                value={formData.seo.metaTitle}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Deskripsi Meta
              </label>
              <textarea
                value={formData.seo.metaDescription}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Kata Kunci Meta
              </label>
              <input
                type="text"
                value={formData.seo.metaKeywords}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaKeywords: e.target.value } })}
                placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Gambar OG
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('seo.ogImage', e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              />
              {currentOgImage && (
                <div className="mt-2">
                  <img src={currentOgImage} alt="OG Image" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured & Stats */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">Project Unggulan</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Dilihat
                </label>
                <input
                  type="number"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Suka
                </label>
                <input
                  type="number"
                  value={formData.likes}
                  onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
                />
              </div>
            </div>
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
            {loading ? 'Menyimpan...' : id ? 'Update Project' : 'Buat Project'}
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
          type="project"
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

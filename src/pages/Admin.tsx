import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { Modal } from '../components/admin/Modal';
import { CategoryForm } from '../components/admin/CategoryForm';
import { PostForm } from './admin/PostForm';
import { ProjectForm } from './admin/ProjectForm';
import { ProfileForm } from './admin/ProfileForm';
import { BlogForm } from './admin/BlogForm';
import { EducationForm } from './admin/EducationForm';
import { SkillForm } from './admin/SkillForm';
import { ExperienceForm } from './admin/ExperienceForm';
import { TemplateForm } from './admin/TemplateForm';
import { CertificateForm } from './admin/CertificateForm';
import { ContactForm } from './admin/ContactForm';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: any;
  status: string;
  publishedDate?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tech?: Array<{ name: string }>;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

export const Admin = () => {
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'education' | 'skills' | 'projects' | 'blog' | 'experience' | 'certificates' | 'categories' | 'cdn' | 'contact' | 'templates' | 'admin-profile' | 'settings'>(
    (searchParams.get('tab') as any) || 'dashboard'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('payload-token');
    setIsAuthenticated(!!token);
    setIsLoading(false);

    if (token) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'dashboard';
    setActiveTab(tab as any);
    
    // Auto reload data when tab or refresh parameter changes (e.g., when returning from form)
    // Only reload if user is authenticated and not in initial loading state
    if (isAuthenticated && !isLoading) {
      fetchData();
    }
  }, [searchParams, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        postsData,
        projectsData,
        categoriesData,
        mediaData,
        educationsData,
        skillsData,
        experiencesData,
        certificatesData,
        contactsData,
        templatesData,
        profilesData,
      ] = await Promise.all([
        api.getPosts().catch(() => ({ docs: [] })),
        api.getProjects().catch(() => ({ docs: [] })),
        api.getCategories().catch(() => ({ docs: [] })),
        api.getMedia().catch(() => ({ docs: [] })),
        api.getCollection('educations').catch(() => ({ docs: [] })),
        api.getCollection('skills').catch(() => ({ docs: [] })),
        api.getCollection('experiences').catch(() => ({ docs: [] })),
        api.getCollection('certificates').catch(() => ({ docs: [] })),
        api.getCollection('contacts').catch(() => ({ docs: [] })),
        api.getCollection('templates').catch(() => ({ docs: [] })),
        api.getCollection('profiles', { limit: 1 }).catch(() => ({ docs: [] })),
      ]);

      setPosts(postsData.docs || []);
      setProjects(projectsData.docs || []);
      setCategories(categoriesData.docs || []);
      setMedia(mediaData.docs || []);
      setEducations(educationsData.docs || []);
      setSkills(skillsData.docs || []);
      setExperiences(experiencesData.docs || []);
      setCertificates(certificatesData.docs || []);
      setContacts(contactsData.docs || []);
      setTemplates(templatesData.docs || []);
      setProfile(profilesData.docs && profilesData.docs.length > 0 ? profilesData.docs[0] : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collection: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.deleteItem(collection, id);
      showNotification('Item berhasil dihapus!', 'success');
      fetchData(); // Reload data after delete
    } catch (error: any) {
      showNotification(error.message || 'Gagal menghapus item', 'error');
    }
  };

  const handleDemoLogin = async () => {
    setUsername('admin');
    setPassword('admin123');
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      await api.login('admin', 'admin123');
      setIsAuthenticated(true);
      fetchData();
    } catch (error: any) {
      setLoginError(error.message || 'Demo login gagal. Pastikan user demo sudah dibuat.');
      setIsLoggingIn(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      fetchData();
    } catch (error: any) {
      setLoginError(error.message || 'Login gagal. Periksa username dan password Anda.');
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card dengan glassmorphism effect */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-600 text-center mb-8">Masuk ke dashboard admin</p>

            {/* Error Message */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {loginError}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">atau</span>
                </div>
              </div>

              {/* Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isLoggingIn ? 'Memproses...' : 'Login Demo (Cepat)'}
              </button>

              {/* Info */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Demo: admin@example.com / admin123
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            © 2024 Portfolio Admin. All rights reserved.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="posts/new" element={<PostForm />} />
      <Route path="posts/:id" element={<PostForm />} />
      <Route path="blog/new" element={<BlogForm />} />
      <Route path="blog/:id" element={<BlogForm />} />
      <Route path="projects/new" element={<ProjectForm />} />
      <Route path="projects/:id" element={<ProjectForm />} />
      <Route path="profile" element={<ProfileForm />} />
      <Route path="education/new" element={<EducationForm />} />
      <Route path="education/:id" element={<EducationForm />} />
      <Route path="skill/new" element={<SkillForm />} />
      <Route path="skill/:id" element={<SkillForm />} />
      <Route path="experience/new" element={<ExperienceForm />} />
      <Route path="experience/:id" element={<ExperienceForm />} />
      <Route path="template/new" element={<TemplateForm />} />
      <Route path="template/:id" element={<TemplateForm />} />
      <Route path="certificate/new" element={<CertificateForm />} />
      <Route path="certificate/:id" element={<CertificateForm />} />
      <Route path="contact/new" element={<ContactForm />} />
      <Route path="contact/:id" element={<ContactForm />} />
      <Route
        path="*"
        element={
          <AdminMain
            activeTab={activeTab}
            setActiveTab={(tab) => navigate(`/admin?tab=${tab}`)}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            posts={posts}
            projects={projects}
            categories={categories}
            media={media}
            educations={educations}
            skills={skills}
            experiences={experiences}
            certificates={certificates}
            contacts={contacts}
            templates={templates}
            profile={profile}
            loading={loading}
            onDelete={handleDelete}
            onEditBlog={(id) => navigate(`/admin/blog/${id}`)}
            onEditProject={(id) => navigate(`/admin/projects/${id}`)}
            onEditEducation={(id) => navigate(`/admin/education/${id}`)}
            onEditSkill={(id) => navigate(`/admin/skill/${id}`)}
            onEditExperience={(id) => navigate(`/admin/experience/${id}`)}
            onEditCertificate={(id) => navigate(`/admin/certificate/${id}`)}
            onEditContact={(id) => navigate(`/admin/contact/${id}`)}
            onEditTemplate={(id) => navigate(`/admin/template/${id}`)}
            onNewBlog={() => navigate('/admin/blog/new')}
            onNewProject={() => navigate('/admin/projects/new')}
            onNewEducation={() => navigate('/admin/education/new')}
            onNewSkill={() => navigate('/admin/skill/new')}
            onNewExperience={() => navigate('/admin/experience/new')}
            onNewCertificate={() => navigate('/admin/certificate/new')}
            onNewTemplate={() => navigate('/admin/template/new')}
            onEditProfile={() => navigate('/admin/profile')}
            onOpenCategoryModal={() => {}}
            onLogout={async () => {
              await api.logout();
              setIsAuthenticated(false);
              navigate('/admin');
            }}
          />
        }
      />
    </Routes>
  );
};

interface AdminMainProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  posts: Post[];
  projects: Project[];
  categories: Category[];
  media: any[];
  educations: any[];
  skills: any[];
  experiences: any[];
  certificates: any[];
  contacts: any[];
  templates: any[];
  profile: any;
  loading: boolean;
  onDelete: (collection: string, id: string) => void;
  onEditBlog: (id: string) => void;
  onEditProject: (id: string) => void;
  onEditEducation: (id: string) => void;
  onEditSkill: (id: string) => void;
  onEditExperience: (id: string) => void;
  onEditCertificate: (id: string) => void;
  onEditContact: (id: string) => void;
  onEditTemplate: (id: string) => void;
  onNewBlog: () => void;
  onNewProject: () => void;
  onNewEducation: () => void;
  onNewSkill: () => void;
  onNewExperience: () => void;
  onNewCertificate: () => void;
  onNewTemplate: () => void;
  onEditProfile: () => void;
  onOpenCategoryModal: () => void;
  onLogout: () => void;
  profile: any;
}

const AdminMain = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  posts,
  projects,
  categories,
  media,
  educations,
  skills,
  experiences,
  certificates,
  contacts,
  templates,
  profile,
  loading,
  onDelete,
  onEditBlog,
  onEditProject,
  onEditEducation,
  onEditSkill,
  onEditExperience,
  onEditCertificate,
  onEditContact,
  onEditTemplate,
  onNewBlog,
  onNewProject,
  onNewEducation,
  onNewSkill,
  onNewExperience,
  onNewCertificate,
  onNewTemplate,
  onEditProfile,
  onOpenCategoryModal,
  onLogout,
}: AdminMainProps) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openCategoryModal = (category?: Category) => {
    setEditingCategory(category || null);
    setIsCategoryModalOpen(true);
    onOpenCategoryModal();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-blue-600 shadow-md z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="text-blue-600 text-xl">🏠</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Menu
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed lg:fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="text-blue-600 text-xl">🏠</span>
              </div>
              <h1 className="text-xl font-bold text-white">
                Menu
              </h1>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto">
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                  { id: 'profile', label: 'Profil', icon: '👤' },
                  { id: 'education', label: 'Pendidikan', icon: '🎓' },
                  { id: 'skills', label: 'Keahlian', icon: '🔧' },
                  { id: 'projects', label: 'Project', icon: '💼' },
                  { id: 'blog', label: 'Blog', icon: '📝' },
                  { id: 'experience', label: 'Pengalaman', icon: '💼' },
                  { id: 'certificates', label: 'Sertifikat', icon: '⭐' },
                  { id: 'categories', label: 'Kategori', icon: '🏷️' },
                  { id: 'cdn', label: 'CDN', icon: '☁️' },
                  { id: 'contact', label: 'Kontak', icon: '✉️' },
                  { id: 'templates', label: 'Template', icon: '💬' },
                  { id: 'admin-profile', label: 'Admin Profile', icon: '👨‍💼' },
                  { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold'
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-2 flex-shrink-0 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm"
              >
                <span>🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

          {/* Overlay for mobile */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          {/* Fixed Header Desktop */}
          <header className="hidden lg:block fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">
                  {activeTab === 'dashboard' ? 'Dashboard' :
                   activeTab === 'profile' ? 'Profil' :
                   activeTab === 'education' ? 'Pendidikan' :
                   activeTab === 'skills' ? 'Keahlian' :
                   activeTab === 'projects' ? 'Project' :
                   activeTab === 'blog' ? 'Blog' :
                   activeTab === 'experience' ? 'Pengalaman' :
                   activeTab === 'certificates' ? 'Sertifikat' :
                   activeTab === 'categories' ? 'Kategori' :
                   activeTab === 'cdn' ? 'CDN' :
                   activeTab === 'contact' ? 'Kontak' :
                   activeTab === 'templates' ? 'Template' :
                   activeTab === 'admin-profile' ? 'Admin Profile' :
                   activeTab === 'settings' ? 'Pengaturan' : 'Admin Panel'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 min-w-0 bg-gray-50 lg:ml-64 pt-16 lg:pt-16">
            <div className="h-full overflow-y-auto p-4 lg:p-8">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-900">Loading...</div>
                </div>
              )}

            {!loading && activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-gray-900 text-sm">Total Posts</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="text-3xl mb-2">💼</div>
                    <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                    <div className="text-gray-900 text-sm">Total Projects</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'published').length}</div>
                    <div className="text-gray-900 text-sm">Published</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-gray-900">{projects.filter(p => p.featured).length}</div>
                    <div className="text-gray-900 text-sm">Featured</div>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'blog' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog</h2>
                  <button
                    onClick={onNewBlog}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Blog
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {posts.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-900">
                              Data belum ada
                            </td>
                          </tr>
                        ) : (
                          posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{post.title}</div>
                                {post.excerpt && (
                                  <div className="text-sm text-gray-900 mt-1 hidden sm:block">{post.excerpt}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {typeof post.category === 'object' ? post.category?.name : post.category || 'Uncategorized'}
                                </span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    post.status === 'published'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {post.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => onEditBlog(post.id)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => onDelete('posts', post.id)}
                                    className="p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Pendidikan</h2>
                  <button
                    onClick={onNewEducation}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Pendidikan
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {educations.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    educations.map((edu) => (
                      <div
                        key={edu.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{edu.institution}</h3>
                        <p className="text-gray-900 mb-2">{edu.degree}</p>
                        {edu.field && <p className="text-sm text-gray-900 mb-2">{edu.field}</p>}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => onEditEducation(edu.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('educations', edu.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Keahlian</h2>
                  <button
                    onClick={onNewSkill}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Keahlian
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skills.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{skill.icon || '💻'}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            skill.level === 'expert' ? 'bg-purple-100 text-purple-700' :
                            skill.level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                            skill.level === 'intermediate' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-900'
                          }`}>
                            {skill.level}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                        {skill.category && (
                          <p className="text-xs text-gray-900 mb-2">{skill.category}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => onEditSkill(skill.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 px-3 rounded text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('skills', skill.id)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengalaman</h2>
                  <button
                    onClick={onNewExperience}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Pengalaman
                  </button>
                </div>
                <div className="space-y-4">
                  {experiences.length === 0 ? (
                    <div className="text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                            <p className="text-gray-900">{exp.company}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditExperience(exp.id)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onDelete('experiences', exp.id)}
                              className="p-2 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {exp.location && <p className="text-sm text-gray-900 mb-2">{exp.location}</p>}
                        {exp.startDate && (
                          <p className="text-sm text-gray-900">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'certificates' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sertifikat</h2>
                  <button
                    onClick={onNewCertificate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + Sertifikat Baru
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.name}</h3>
                        <p className="text-gray-900 mb-2">{cert.issuer}</p>
                        {cert.issueDate && (
                          <p className="text-sm text-gray-900">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => onEditCertificate(cert.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('certificates', cert.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kontak</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Subject</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {contacts.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-900">
                              Data belum ada
                            </td>
                          </tr>
                        ) : (
                          contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{contact.name}</div>
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell text-gray-900">{contact.email}</td>
                              <td className="px-4 py-3 hidden md:table-cell text-gray-900">{contact.subject}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => onEditContact(contact.id)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => onDelete('contacts', contact.id)}
                                    className="p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'templates' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Template</h2>
                  <button
                    onClick={onNewTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-gray-900 mb-4">{template.description}</p>
                        )}
                        {template.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {template.category}
                          </span>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => onEditTemplate(template.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('templates', template.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Profil</h2>
                  <button
                    onClick={onEditProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    Edit Profile
                  </button>
                </div>
                {profile ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* CV-Style Header dengan Foto */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Foto Profil */}
                        <div className="flex-shrink-0">
                          {profile.formalPhoto?.url ? (
                            <img
                              src={profile.formalPhoto.url}
                              alt={profile.name}
                              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                          ) : (
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                              <span className="text-4xl sm:text-5xl">👤</span>
                            </div>
                          )}
                        </div>
                        {/* Informasi Header */}
                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="text-3xl sm:text-4xl font-bold mb-2">{profile.name || 'Nama Lengkap'}</h2>
                          <p className="text-xl sm:text-2xl text-blue-100 mb-3">{profile.position || 'Jabatan'}</p>
                          {profile.profession && (
                            <p className="text-lg text-blue-100 mb-4">{profile.profession}</p>
                          )}
                          {profile.shortDescription && (
                            <p className="text-blue-50 text-sm sm:text-base max-w-2xl">{profile.shortDescription}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Konten CV */}
                    <div className="p-6 sm:p-8 space-y-8">
                      {/* Informasi Kontak */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span>📞</span> Informasi Kontak
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {profile.email && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-2xl">✉️</span>
                              <div>
                                <p className="text-xs text-gray-600">Email</p>
                                <a href={`mailto:${profile.email}`} className="text-gray-900 font-medium hover:text-blue-600">
                                  {profile.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {profile.phone && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-2xl">📱</span>
                              <div>
                                <p className="text-xs text-gray-600">Telepon</p>
                                <a href={`tel:${profile.phone}`} className="text-gray-900 font-medium hover:text-blue-600">
                                  {profile.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {profile.whatsapp && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-2xl">💬</span>
                              <div>
                                <p className="text-xs text-gray-600">WhatsApp</p>
                                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-green-600">
                                  {profile.whatsapp}
                                </a>
                              </div>
                            </div>
                          )}
                          {profile.address && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-2xl">📍</span>
                              <div>
                                <p className="text-xs text-gray-600">Alamat</p>
                                <p className="text-gray-900 font-medium">{profile.address}</p>
                              </div>
                            </div>
                          )}
                          {profile.status && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-2xl">⚡</span>
                              <div>
                                <p className="text-xs text-gray-600">Status</p>
                                <p className="text-gray-900 font-medium">
                                  {profile.status === 'available' ? '✅ Tersedia untuk Freelance' :
                                   profile.status === 'unavailable' ? '❌ Tidak Tersedia' :
                                   profile.status === 'busy' ? '⏳ Sibuk' : profile.status}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Social Media */}
                      {(profile.githubUrl || profile.linkedinUrl || profile.facebookUrl || profile.instagramUrl) && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🔗</span> Social Media
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {profile.githubUrl && (
                              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                <span>🐙</span> GitHub
                              </a>
                            )}
                            {profile.linkedinUrl && (
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <span>💼</span> LinkedIn
                              </a>
                            )}
                            {profile.facebookUrl && (
                              <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                <span>👥</span> Facebook
                              </a>
                            )}
                            {profile.instagramUrl && (
                              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                                <span>📷</span> Instagram
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Statistik Pencapaian */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span>📊</span> Statistik Pencapaian
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                            <p className="text-3xl font-bold text-blue-600 mb-1">{profile.yearsExperience || 0}+</p>
                            <p className="text-sm text-gray-700 font-medium">Tahun Pengalaman</p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                            <p className="text-3xl font-bold text-green-600 mb-1">{profile.projectsCompleted || 0}+</p>
                            <p className="text-sm text-gray-700 font-medium">Proyek Selesai</p>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                            <p className="text-3xl font-bold text-purple-600 mb-1">{profile.specialCourses || 0}+</p>
                            <p className="text-sm text-gray-700 font-medium">Kursus Khusus</p>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                            <p className="text-3xl font-bold text-orange-600 mb-1">{profile.satisfiedClients || 0}+</p>
                            <p className="text-sm text-gray-700 font-medium">Klien Puas</p>
                          </div>
                        </div>
                      </div>

                      {/* Deskripsi Lengkap */}
                      {profile.fullDescription && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>📝</span> Tentang Saya
                          </h3>
                          <div 
                            className="prose prose-sm max-w-none text-gray-900"
                            dangerouslySetInnerHTML={{ __html: profile.fullDescription }}
                          />
                        </div>
                      )}

                      {/* Foto dan CV */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span>📎</span> Dokumen & Media
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {profile.informalPhoto?.url && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-2">Foto Non-Formal</p>
                              <img
                                src={profile.informalPhoto.url}
                                alt="Foto Non-Formal"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          {profile.formalPhoto?.url && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-2">Foto Formal</p>
                              <img
                                src={profile.formalPhoto.url}
                                alt="Foto Formal"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          {profile.cv?.url && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                              <div className="text-6xl mb-3">📄</div>
                              <p className="text-sm font-medium text-gray-700 mb-3">CV/Resume</p>
                              <a
                                href={profile.cv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                              >
                                📥 Download CV
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-gray-600 mb-6">Belum ada data profil. Klik "Edit Profile" untuk membuat profil baru.</p>
                    <button
                      onClick={onEditProfile}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {!loading && activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h2>
                  <button
                    onClick={onNewProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Project
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          {project.featured && <span className="text-yellow-500">⭐</span>}
                        </div>
                        <p className="text-gray-900 text-sm mb-4">{project.description}</p>
                        {project.tech && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                              >
                                {typeof t === 'object' ? t.name : String(t)}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditProject(project.id)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete('projects', project.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'categories' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kategori</h2>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    + New Kategori
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openCategoryModal(category)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onDelete('categories', category.id)}
                              className="p-2 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'cdn' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">CDN Settings</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">CDN URL</label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://cdn.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">CDN Key</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your CDN API Key"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Save CDN Settings
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'admin-profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Profile</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Admin Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Admin Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Update Admin Profile
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengaturan</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Site Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Site Description</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      defaultValue="My Portfolio Website"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Save Settings
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && activeTab === 'media' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Media Library</h2>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap cursor-pointer">
                    + Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await api.uploadMedia(file);
                            window.location.reload();
                          } catch (error: any) {
                            showNotification(error.message || 'Gagal upload media', 'error');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {media.length === 0 ? (
                    <div className="col-span-full text-center text-gray-900 py-12 bg-white rounded-xl">
                      Data belum ada
                    </div>
                  ) : (
                    media.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer relative group"
                      >
                        {item.url ? (
                          <img src={item.url} alt={item.alt || ''} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-4xl">🖼️</span>
                        )}
                        <button
                          onClick={() => onDelete('media', item.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
            </div>
          </main>
      </div>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Kategori' : 'New Kategori'}
        size="sm"
      >
        <CategoryForm
          category={editingCategory || undefined}
          onSuccess={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            fetchData(); // Reload data after category save
          }}
          onCancel={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      </Modal>
    </>
  );
};

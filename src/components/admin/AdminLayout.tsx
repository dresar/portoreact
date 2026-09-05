import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  onBack?: () => void;
}

export const AdminLayout = ({ children, title, onBack }: AdminLayoutProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTab = searchParams.get('tab') || 'dashboard';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/admin?tab=' + activeTab);
    }
  };

  return (
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
                    navigate(`/admin?tab=${tab.id}`);
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
              onClick={async () => {
                await api.logout();
                navigate('/admin');
                window.location.reload();
              }}
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

      {/* Fixed Header Desktop */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-gray-900 hover:text-black flex items-center gap-2 text-sm sm:text-base"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                await api.logout();
                navigate('/admin');
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-gray-50 lg:ml-64 pt-16 lg:pt-16">
        <div className="h-full overflow-y-auto p-4 lg:p-8">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={handleBack}
              className="text-gray-900 hover:text-black mb-4 flex items-center gap-2 text-sm sm:text-base"
            >
              ← Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

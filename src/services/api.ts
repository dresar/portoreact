const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('payload-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth - Login dengan username
  async login(username: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        let errorMessage = 'Login gagal';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || `Login failed: ${res.status}`;
        } catch {
          errorMessage = `Login failed: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      
      // Store token
      if (data.token) {
        localStorage.setItem('payload-token', data.token);
      }
      if (data.user) {
        localStorage.setItem('payload-user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Server tidak dapat dijangkau. Pastikan server berjalan di http://localhost:3000');
      }
      throw error;
    }
  }

  async logout() {
    try {
      // Call logout endpoint
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('payload-token');
      localStorage.removeItem('payload-user');
    }
  }

  // Posts CRUD
  async getPosts(params?: { page?: number; limit?: number; where?: any }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.where) query.append('where', JSON.stringify(params.where));

    const res = await fetch(`${API_BASE_URL}/posts?${query}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) {
      // Return empty data instead of throwing error
      return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
    }
    return res.json();
  }

  async getPost(id: string) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  }

  async createPost(data: any) {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  }

  async updatePost(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  }

  async deletePost(id: string) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  }

  // Projects CRUD
  async getProjects(params?: { page?: number; limit?: number; where?: any }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.where) query.append('where', JSON.stringify(params.where));

    const res = await fetch(`${API_BASE_URL}/projects?${query}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) {
      // Return empty data instead of throwing error
      return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
    }
    return res.json();
  }

  async getProject(id: string) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  }

  async createProject(data: any) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  }

  async updateProject(id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  }

  async deleteProject(id: string) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  }

  // Categories CRUD
  async getCategories(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE_URL}/categories?${query}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) {
      return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
    }
    return res.json();
  }

  async createCategory(data: { name: string }) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  }

  async updateCategory(id: string, data: { name: string }) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  }

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  }

  // Media CRUD
  async getMedia(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE_URL}/media?${query}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) {
      return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
    }
    return res.json();
  }

  async uploadMedia(file: File): Promise<any> {
    try {
      // Validate file
      if (!file) {
        throw new Error('File tidak ditemukan');
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File terlalu besar. Maksimal 50MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('payload-token');
      const res = await fetch(`${API_BASE_URL}/media`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Gagal mengupload file';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          
          // Add more context based on status code
          if (res.status === 400) {
            errorMessage = `Format file tidak didukung atau file terlalu besar. ${errorData.message || ''}`;
          } else if (res.status === 500) {
            errorMessage = `Error server: ${errorData.message || 'Terjadi kesalahan saat mengupload file'}`;
          } else if (res.status === 413) {
            errorMessage = 'File terlalu besar. Maksimal 50MB';
          }
        } catch (parseError) {
          errorMessage = `Gagal mengupload file: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error: any) {
      console.error('Upload media error:', error);
      
      // Re-throw with user-friendly message
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Server tidak dapat dijangkau. Pastikan server berjalan di http://localhost:3000');
      }
      
      throw error;
    }
  }

  async deleteMedia(id: string) {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete media');
    return res.json();
  }

  // Generic CRUD for any collection
  async getCollection(collection: string, params?: any) {
    try {
      const query = new URLSearchParams();
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });

      const res = await fetch(`${API_BASE_URL}/${collection}?${query}`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) {
        console.warn(`Failed to fetch ${collection}:`, res.status, res.statusText);
        return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
      }
      return res.json();
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      return { docs: [], totalDocs: 0, limit: 10, totalPages: 0, page: 1 };
    }
  }

  async getItem(collection: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/${collection}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to get ${collection}`);
    return res.json();
  }

  async createItem(collection: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/${collection}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create ${collection}`);
    return res.json();
  }

  async updateItem(collection: string, id: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/${collection}/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update ${collection}`);
    return res.json();
  }

  async deleteItem(collection: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/${collection}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete ${collection}`);
    return res.json();
  }

  // Profile
  async getProfile() {
    try {
      const data = await this.getCollection('profiles', { limit: 1 });
      return data.docs && data.docs.length > 0 ? data.docs[0] : null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }

  // Experiences
  async getExperiences() {
    try {
      const data = await this.getCollection('experiences', { limit: 100 });
      return data.docs || [];
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      return [];
    }
  }

  // Skills
  async getSkills() {
    try {
      const data = await this.getCollection('skills', { limit: 100 });
      return data.docs || [];
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      return [];
    }
  }
}

export const api = new ApiService();


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let tokenGetter = null;
let currentUserInfoGetter = null;

export const setAuthTokenGetter = (getter, userInfoGetter = null) => {
  tokenGetter = getter;
  if (userInfoGetter) {
    currentUserInfoGetter = userInfoGetter;
  }
};

// Request interceptor to attach Clerk Token and user headers
api.interceptors.request.use(
  async (config) => {
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('[API Client] Error getting token:', err);
      }
    }

    if (currentUserInfoGetter) {
      const userInfo = currentUserInfoGetter();
      if (userInfo) {
        if (userInfo.email) config.headers['x-user-email'] = userInfo.email;
        if (userInfo.name) config.headers['x-user-name'] = userInfo.name;
        if (userInfo.avatarUrl) config.headers['x-user-avatar'] = userInfo.avatarUrl;
        if (userInfo.isDemo) {
          config.headers['x-demo-user-id'] = userInfo.userId;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ================= Projects API =================
export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data.data;
};

export const getProject = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data.data;
};

export const createProject = async (projectData) => {
  const res = await api.post('/projects', projectData);
  return res.data.data;
};

export const updateProject = async (id, projectData) => {
  const res = await api.put(`/projects/${id}`, projectData);
  return res.data.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const addProjectMember = async (projectId, { email, role }) => {
  const res = await api.post(`/projects/${projectId}/members`, { email, role });
  return res.data.data;
};

export const removeProjectMember = async (projectId, userId) => {
  const res = await api.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};

// ================= Tasks API =================
export const getProjectTasks = async (projectId) => {
  const res = await api.get(`/tasks/project/${projectId}`);
  return res.data.data;
};

export const getTask = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data.data;
};

export const createTask = async (taskData) => {
  const res = await api.post('/tasks', taskData);
  return res.data.data;
};

export const updateTask = async (taskId, taskData) => {
  const res = await api.put(`/tasks/${taskId}`, taskData);
  return res.data.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

// ================= Comments API =================
export const getTaskComments = async (taskId) => {
  const res = await api.get(`/comments/task/${taskId}`);
  return res.data.data;
};

export const createComment = async ({ taskId, content }) => {
  const res = await api.post('/comments', { taskId, content });
  return res.data.data;
};

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

// ================= Users API =================
export const syncUserProfile = async (userData) => {
  const res = await api.post('/users/sync', userData);
  return res.data.data;
};

export const searchUsers = async (q) => {
  const res = await api.get(`/users/search?q=${encodeURIComponent(q || '')}`);
  return res.data.data;
};

export const getUserProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data.data;
};

export default api;

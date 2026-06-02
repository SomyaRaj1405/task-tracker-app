const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper that manages JWT tokens and error mappings
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set up default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject Bearer token if it exists in localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('velotask_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    ...options,
    headers,
  };

  // Convert body to JSON string if it's an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `API error: ${response.status} ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Failure [${config.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

const api = {
  // Authentication Endpoints
  auth: {
    signup: (name, email, password) => 
      request('/auth/signup', { method: 'POST', body: { name, email, password } }),
    
    login: (email, password) => 
      request('/auth/login', { method: 'POST', body: { email, password } }),
  },

  // Task Endpoints
  tasks: {
    getAll: (status = 'all', search = '') => {
      let query = '';
      const params = [];
      
      if (status && status !== 'all') params.push(`status=${status}`);
      if (search && search.trim() !== '') params.push(`search=${encodeURIComponent(search)}`);
      
      if (params.length > 0) {
        query = `?${params.join('&')}`;
      }
      
      return request(`/tasks${query}`, { method: 'GET' });
    },
    
    getById: (id) => 
      request(`/tasks/${id}`, { method: 'GET' }),
    
    create: (title, description) => 
      request('/tasks', { method: 'POST', body: { title, description } }),
    
    update: (id, updates) => 
      request(`/tasks/${id}`, { method: 'PATCH', body: updates }),
    
    delete: (id) => 
      request(`/tasks/${id}`, { method: 'DELETE' }),
    
    getStats: () => 
      request('/tasks/stats', { method: 'GET' }),
  }
};

export default api;

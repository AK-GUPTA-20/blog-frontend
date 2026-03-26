const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '/api/v1').trim().replace(/\/$/, '');
const BASE_URL = buildApiUrl(`${API_PREFIX}/posts`);
const TOKEN_KEY = 'velora_token';

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

function getBearerToken(token) {
  const rawToken = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : '');
  if (!rawToken) return '';
  return rawToken.toLowerCase().startsWith('bearer ') ? rawToken : `Bearer ${rawToken}`;
}

function createAuthHeaders(token, includeJson = true) {
  const headers = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  const bearer = getBearerToken(token);
  if (bearer) headers['Authorization'] = bearer;
  return headers;
}

async function parseResponse(res, fallbackMessage) {
  if (res.status === 429) throw new Error('Too many requests. Please try again later.');

  let data = null;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    data = text ? { message: text } : {};
  }

  if (!res.ok) {
    const error = new Error(data?.message || fallbackMessage);
    error.status = res.status;
    throw error;
  }

  return data;
}

async function apiFetch(url, options = {}) {
  return fetch(url, { ...options, credentials: 'omit' });
}

export async function createPost(token, postData) {
  const res = await apiFetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify(postData),
  });

  return parseResponse(res, 'Failed to create post.');
}

export async function updatePost(token, postId, postData) {
  const res = await apiFetch(`${BASE_URL}/${postId}`, {
    method: 'PUT',
    headers: createAuthHeaders(token),
    body: JSON.stringify(postData),
  });

  return parseResponse(res, 'Failed to update post.');
}

export async function getMyPosts(token, page = 1, limit = 10) {
  const res = await apiFetch(`${BASE_URL}/me/posts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: createAuthHeaders(token),
  });

  return parseResponse(res, 'Failed to fetch your posts.');
}

export async function getPostById(postId) {
  const res = await apiFetch(`${BASE_URL}/${postId}`, {
    method: 'GET',
  });

  return parseResponse(res, 'Failed to fetch post.');
}

export async function deletePost(token, postId) {
  const res = await apiFetch(`${BASE_URL}/${postId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  });

  return parseResponse(res, 'Failed to delete post.');
}

export async function uploadFeaturedImage(token, file) {
  const fieldNames = ['image', 'featuredImage', 'file'];
  let lastError = null;

  for (const fieldName of fieldNames) {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const res = await apiFetch(`${BASE_URL}/upload-featured-image`, {
        method: 'POST',
        headers: createAuthHeaders(token, false),
        body: formData,
      });

      return parseResponse(res, 'Failed to upload image.');
    } catch (error) {
      lastError = error;
      const isFieldError = String(error.message || '').toLowerCase().includes('field');
      if (!isFieldError) throw error;
    }
  }

  throw lastError || new Error('Failed to upload image.');
}

export async function publishScheduledPosts(token) {
  const res = await apiFetch(`${BASE_URL}/admin/publish-scheduled`, {
    method: 'POST',
    headers: createAuthHeaders(token),
  });

  return parseResponse(res, 'Failed to publish scheduled posts.');
}
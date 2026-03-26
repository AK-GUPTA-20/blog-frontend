const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '/api/v1').trim().replace(/\/$/, '');
const BASE_URL = buildApiUrl(`${API_PREFIX}/comments`);

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

function createAuthHeaders(token, includeJson = true) {
  const headers = includeJson ? { 'Content-Type': 'application/json' } : {};
  
  if (token) {
    const bearer = token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = bearer;
  }

  return headers;
}

async function parseResponse(res, fallbackMessage) {
  if (res.status === 429) {
    throw new Error('Too many requests. Please try again later.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    const rawText = await res.text();
    data = rawText ? { message: rawText } : {};
  }

  if (!res.ok) {
    const error = new Error(data?.message || fallbackMessage);
    error.status = res.status;
    throw error;
  }
  return data;
}

async function apiFetch(url, options = {}) {
  const finalOptions = {
    ...options,
    credentials: 'omit',
  };
  return fetch(url, finalOptions);
}

// Public endpoints
export async function getPostComments(postId, page = 1, limit = 10) {
  const params = new URLSearchParams({ page, limit });
  const res = await apiFetch(`${BASE_URL}/post/${postId}?${params}`);
  return parseResponse(res, 'Failed to fetch comments.');
}

export async function getComment(commentId) {
  const res = await apiFetch(`${BASE_URL}/${commentId}`);
  return parseResponse(res, 'Failed to fetch comment.');
}

export async function getCommentReplies(commentId, page = 1, limit = 5) {
  const params = new URLSearchParams({ page, limit });
  const res = await apiFetch(`${BASE_URL}/${commentId}/replies?${params}`);
  return parseResponse(res, 'Failed to fetch comment replies.');
}

// Protected endpoints
export async function createComment(token, postId, payload) {
  const res = await apiFetch(`${BASE_URL}/post/${postId}/create`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse(res, 'Failed to create comment.');
}

export async function replyToComment(token, commentId, payload) {
  const res = await apiFetch(`${BASE_URL}/${commentId}/reply`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse(res, 'Failed to reply to comment.');
}

export async function updateComment(token, commentId, payload) {
  const res = await apiFetch(`${BASE_URL}/${commentId}`, {
    method: 'PUT',
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse(res, 'Failed to update comment.');
}

export async function deleteComment(token, commentId) {
  const res = await apiFetch(`${BASE_URL}/${commentId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  });
  return parseResponse(res, 'Failed to delete comment.');
}

export async function likeComment(token, commentId) {
  const res = await apiFetch(`${BASE_URL}/${commentId}/like`, {
    method: 'POST',
    headers: createAuthHeaders(token),
  });
  return parseResponse(res, 'Failed to like comment.');
}

// Admin endpoints
export async function getAllComments(adminToken, page = 1, limit = 20, isDeleted = false) {
  const params = new URLSearchParams({ page, limit, isDeleted });
  const res = await apiFetch(`${BASE_URL}/admin/get-all/comments?${params}`, {
    method: 'GET',
    headers: createAuthHeaders(adminToken),
  });
  return parseResponse(res, 'Failed to fetch all comments.');
}

export async function forceDeleteComment(adminToken, commentId, reason = '') {
  const res = await apiFetch(`${BASE_URL}/admin/delete/${commentId}/force`, {
    method: 'DELETE',
    headers: createAuthHeaders(adminToken),
    body: JSON.stringify({ reason }),
  });
  return parseResponse(res, 'Failed to force delete comment.');
}
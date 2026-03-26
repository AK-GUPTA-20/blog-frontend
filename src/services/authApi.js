const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '/api/v1').trim().replace(/\/$/, '');
const BASE_URL = buildApiUrl(`${API_PREFIX}/auth`);

function normalizeMaybeString(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const lowered = trimmed.toLowerCase();
  if (lowered === 'null' || lowered === 'undefined') return '';
  return trimmed;
}

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

function resolveBearerToken(token) {
  const fallbackToken = typeof window !== 'undefined' ? localStorage.getItem('velora_token') : '';
  const rawToken = normalizeMaybeString(token) || normalizeMaybeString(fallbackToken);
  if (!rawToken) return '';
  return rawToken.toLowerCase().startsWith('bearer ')
    ? rawToken
    : `Bearer ${rawToken}`;
}

export function getAuthPayload(payload, fallbackUser = {}) {
  const root = payload || {};
  const nested = root?.data || {};

  const user = root?.user || nested?.user || nested?.data?.user || fallbackUser;

  const token = normalizeMaybeString(
    root?.token
    || root?.accessToken
    || root?.jwt
    || root?.user?.token
    || root?.user?.accessToken
    || root?.user?.jwt
    || nested?.token
    || nested?.accessToken
    || nested?.jwt
    || nested?.user?.token
    || nested?.user?.accessToken
    || nested?.user?.jwt
    || nested?.data?.token
    || nested?.data?.accessToken
    || nested?.data?.jwt
    || nested?.data?.user?.token
    || nested?.data?.user?.accessToken
    || nested?.data?.user?.jwt
  );

  return { user, token };
}

function createAuthHeaders(token, includeJson = true) {
  const bearer = resolveBearerToken(token);
  const headers = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (bearer) {
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
    credentials: 'omit', // We primarily rely on Bearer tokens. Change to 'include' if backend uses cookies.
  };
  return fetch(url, finalOptions);
}

export async function registerUser({ name, email, password, gender }) {
  const res = await apiFetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, gender }),
  });
  return parseResponse(res, 'Registration failed.');
}

export async function verifyOtp({ email, otp }) {
  const res = await apiFetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return parseResponse(res, 'OTP verification failed.');
}

export async function resendOtp({ email }) {
  const res = await apiFetch(`${BASE_URL}/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return parseResponse(res, 'Failed to resend OTP.');
}

export async function loginUser({ email, password }) {
  const res = await apiFetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(res, 'Login failed.');
}

export async function getMyProfile(token) {
  const res = await apiFetch(buildApiUrl(`${API_PREFIX}/auth/me/profile`), {
    method: 'GET',
    headers: createAuthHeaders(token),
  });
  return parseResponse(res, 'Failed to fetch profile.');
}

export async function updateMyProfile(token, payload) {
  const res = await apiFetch(`${BASE_URL}/me/update-profile`, {
    method: 'PUT',
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return parseResponse(res, 'Failed to update profile.');
}

export async function uploadProfileImage(token, file) {
  const candidateFields = ['image', 'avatar', 'profileImage', 'file'];
  let lastError = null;

  for (const fieldName of candidateFields) {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const res = await apiFetch(`${BASE_URL}/me/upload-profile-image`, {
        method: 'POST',
        headers: createAuthHeaders(token, false),
        body: formData,
      });

      return await parseResponse(res, 'Failed to upload profile image.');
    } catch (error) {
      lastError = error;
      const message = String(error?.message || '').toLowerCase();
      const shouldTryAnotherField =
        message.includes('unexpected field') ||
        message.includes('multipart') ||
        message.includes('field');

      if (!shouldTryAnotherField) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Failed to upload profile image.');
}

export async function changePassword(token, payload) {
  const res = await apiFetch(`${BASE_URL}/me/change-password`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify({
      currentPassword: payload?.currentPassword ?? payload?.oldPassword,
      newPassword: payload?.newPassword,
      confirmPassword: payload?.confirmPassword,
    }),
  });

  return parseResponse(res, 'Failed to change password.');
}

export async function deleteAccount(token, password) {
  const res = await apiFetch(`${BASE_URL}/me/delete-account`, {
    headers: createAuthHeaders(token),
    body: JSON.stringify({ password }),
  });
  return parseResponse(res, 'Failed to delete account.');
}

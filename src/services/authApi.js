const BASE_URL = '/api/v1/auth';

function resolveBearerToken(token) {
  const fallbackToken = typeof window !== 'undefined' ? localStorage.getItem('velora_token') : '';
  const rawToken = (token || fallbackToken || '').trim();
  if (!rawToken) return '';
  return rawToken.toLowerCase().startsWith('bearer ')
    ? rawToken
    : `Bearer ${rawToken}`;
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
    throw new Error(data?.message || fallbackMessage);
  }
  return data;
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  return data;
}

export async function verifyOtp({ email, otp }) {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  return data;
}

export async function resendOtp({ email }) {
  const res = await fetch(`${BASE_URL}/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return data;
}

export async function getMyProfile(token) {
  const res = await fetch('/api/v1/auth/me/profile', {
    method: 'GET',
    headers: createAuthHeaders(token),
  });
  return parseResponse(res, 'Failed to fetch profile.');
}

export async function updateMyProfile(token, payload) {
  const res = await fetch(`${BASE_URL}/me/update-profile`, {
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

      const res = await fetch(`${BASE_URL}/me/upload-profile-image`, {
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
  const res = await fetch(`${BASE_URL}/me/change-password`, {
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
  const res = await fetch(`${BASE_URL}/me/delete-account`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: JSON.stringify({ password }),
  });
  return parseResponse(res, 'Failed to delete account.');
}

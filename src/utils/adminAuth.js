let adminToken = null;

export function getAdminToken() {
  return adminToken;
}

export function setAdminToken(token) {
  adminToken = token;
}

export function clearAdminToken() {
  adminToken = null;
}

export async function adminFetch(url, options = {}) {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  return response;
}

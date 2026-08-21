export function getAdminToken() {
  return localStorage.getItem("veyid_admin_token");
}

export function setAdminToken(token) {
  localStorage.setItem("veyid_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("veyid_admin_token");
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

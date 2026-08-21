export function getAdminToken() {
  return sessionStorage.getItem("veyid_admin_token");
}

export function setAdminToken(token) {
  sessionStorage.setItem("veyid_admin_token", token);
}

export function clearAdminToken() {
  sessionStorage.removeItem("veyid_admin_token");
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

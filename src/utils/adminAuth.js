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

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearAdminToken();
    } else {
      const path = window.location.pathname;
      if (!getAdminToken() && path.startsWith("/admin") && path !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
  });
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

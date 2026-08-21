let adminToken = null;
let hiddenAt = null;

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

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
      hiddenAt = Date.now();
    } else {
      if (hiddenAt && Date.now() - hiddenAt > TIMEOUT_MS) {
        clearAdminToken();
        const path = window.location.pathname;
        if (path.startsWith("/admin") && path !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
      hiddenAt = null;
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

export function getToken() {
    return localStorage.getItem("token");
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(`${BASE_URL}${url}`, { ...options, headers })
        .then((res) => {
            if (res.status === 401) {
                alert(
                    "You must be logged in or your token expired. Please login."
                );
                localStorage.clear();
                throw new Error("Unauthorized");
            }
            if (!res.ok) {
                throw new Error("API Error");
            }
            return res.json();
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err?.message || "Internal server error");
        });
}

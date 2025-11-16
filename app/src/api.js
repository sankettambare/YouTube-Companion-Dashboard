const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res, method, path) {
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${method} ${path} ${res.status}: ${err}`);
  }
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) return res.json();
  return null;
}

export async function apiGet(path) {
  return handleRes(await fetch(API_BASE_URL + path), "GET", path);
}

export async function apiPost(path, body) {
  return handleRes(
    await fetch(API_BASE_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }),
    "POST",
    path
  );
}

export async function apiPatch(path, body) {
  return handleRes(
    await fetch(API_BASE_URL + path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }),
    "PATCH",
    path
  );
}

export async function apiPut(path, body) {
  return handleRes(
    await fetch(API_BASE_URL + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }),
    "PUT",
    path
  );
}

export async function apiDelete(path) {
  return handleRes(
    await fetch(API_BASE_URL + path, { method: "DELETE" }),
    "DELETE",
    path
  );
}

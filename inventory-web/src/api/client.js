const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

/**
 * Thin fetch wrapper: builds the URL, sends JSON, checks the status and
 * turns any failure into an Error with a user-readable message.
 */
export async function request(path, { body, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server.");
  }

  // Some responses (204 NoContent, NotFound()) have an empty body.
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    // The API returns plain strings (Conflict/NotFound) or ProblemDetails (validation).
    const message =
      typeof data === "string" && data
        ? data
        : (data?.title ?? `Request failed (status ${response.status}).`);
    throw new Error(message);
  }

  return data;
}

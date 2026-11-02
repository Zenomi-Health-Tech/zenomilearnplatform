/**
 * Talking to the Zenomi backend.
 *
 * ZenomiLearn has no accounts of its own. A teen arrives from the app or the
 * user portal already signed in, exchanges a one time handoff token for a code
 * sent to the address on their account, and that gives this site the same user
 * token the app uses.
 */
export const API =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://zenomi.elitceler.com/api/v1";

const TOKEN_KEY = "zenomi_learn_token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (t: string) => {
  try {
    window.localStorage.setItem(TOKEN_KEY, t);
  } catch {}
};

export const clearToken = () => {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

type Json = Record<string, unknown>;

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(init?.headers as Record<string, string>),
    },
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body: body as Json };
}

/** Exchanges the handoff token and emails the code. Returns the masked address. */
export const sendLearnCode = (token: string) =>
  call("/users/learn/send-code", { method: "POST", body: JSON.stringify({ token }) });

/** The code the teen typed. Gives back a user token on success. */
export const verifyLearnCode = (token: string, otp: string) =>
  call("/users/learn/verify-code", { method: "POST", body: JSON.stringify({ token, otp }) });

/**
 * Whether the courses are open yet. The backend returns the assessments still
 * outstanding by name, so the page can say which ones rather than just no.
 */
export const getCourseAccess = () => call("/users/courses");

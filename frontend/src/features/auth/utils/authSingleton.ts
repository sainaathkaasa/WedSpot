let accessToken: string | null = null;
let refreshToken: string | null = null;
let role: string | null = null;
let userName: string | null = null;
let email: string | null = null;

export const authStore = {
  getAccessToken: (): string | null => accessToken,
  setAccessToken: (token: string | null): void => {
    accessToken = token;
  },
  getRefreshToken: (): string | null => refreshToken,
  setRefreshToken: (token: string | null): void => {
    refreshToken = token;
  },
  getRole: () => role,
  setRole: (r: string | null) => { role = r; },
  getUserName: () => userName,
  setUserName: (name: string | null) => { userName = name; },
  getEmail: () => email,
  setEmail: (e: string | null) => { email = e; },
  clearAll: (): void => {
    accessToken = null;
    refreshToken = null;
    role = null;
    userName = null;
    email = null;
  },
};

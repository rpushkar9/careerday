const API_URL = 'http://localhost:5000/api/auth';

// Define interfaces for type safety
interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse {
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  [key: string]: any; // fallback for additional fields
}

// Signup API call
export const signup = async (userData: SignupData): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data: ApiResponse = await response.json();
  if (!response.ok) throw new Error(data.message || 'Signup failed');

  return data;
};

// Login API call
export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data: ApiResponse = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');

  return data;
};

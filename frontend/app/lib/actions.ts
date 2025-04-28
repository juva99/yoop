"use server"

import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

type ProtectedResponse = {
  message: string;
};

//temp - only for testing
export const getProfile = async (): Promise<ProtectedResponse> => {
  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  const result = await response.json();
  return result;
}
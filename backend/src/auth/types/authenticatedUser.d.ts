export type authenticatedUser = {
  uid: string;
  name?: string;
  role: string;
  accessToken: string;
  refreshToken: string;
};

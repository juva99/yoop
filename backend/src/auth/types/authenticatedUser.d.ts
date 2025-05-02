export type authenticatedUser = {
  uid: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
};

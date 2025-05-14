import { Role } from "src/enums/role.enum";

export type authenticatedUser = {
  uid: string;
  name?: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};

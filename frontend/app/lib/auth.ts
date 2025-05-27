"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL, FRONTEND_URL } from "./constants";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { createSession, updateTokens } from "./session";
import { Role } from "@/app/enums/role.enum";
import { cookies } from "next/headers";

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    userEmail: formData.get("userEmail"),
    pass: formData.get("pass"),
    passConfirm: formData.get("passConfirm"),
    phoneNum: formData.get("phoneNum"),
    birthDay: formData.get("birthDay"),
    address: formData.get("address"),
    role: Role.USER,
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    await login(state, formData);
  } else {
    return {
      message:
        response.status === 409
          ? "קיים משתמש עם כתובת האימייל שבחרת"
          : response.statusText,
    };
  }
}

export async function login(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validationFields = LoginFormSchema.safeParse({
    userEmail: formData.get("userEmail"),
    pass: formData.get("pass"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  if (response.ok) {
    const result = await response.json();

    await createSession({
      user: {
        uid: result.uid,
        name: result.name,
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    const roleRedirectMap: Record<string, string> = {
      user: "/",
      field_manager: "/field-manager/fields",
      admin: "/field-manager/fields", //כרגע זה מנהל המערכת נשנה את זה אחרכך
    };

    const redirectPath = roleRedirectMap[result.role] ?? "/";
    redirect(redirectPath);
  } else {
    return {
      message:
        response.status === 401 ? "הפרטים לא נכונים" : response.statusText,
    };
  }
}

export const refreshToken = async (
  oldRefreshToken: string,
): Promise<string | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token" + response.statusText);
    }
    const { accessToken, refreshToken } = await response.json();
    await updateTokens({
      accessToken,
      refreshToken,
    });

    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
};

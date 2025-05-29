"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { createSession, updateTokens, updateSessionUser } from "./session";
import { SignupFormValues } from "@/app/auth/signup/signupForm";
import { ProfileUpdateFormValues } from "./schemas/profile_update_schema";
import { authFetch } from "./authFetch";

export async function signup(formData: SignupFormValues): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log(response);
  if (response.ok) {
    await login(formData.userEmail, formData.pass);
  } else {
    return {
      error: true,
      message:
        response.status === 409
          ? "קיים משתמש עם כתובת האימייל שבחרת"
          : response.statusText,
    };
  }
}

export async function login(userMail: string, pass: string): Promise<any> {
  const loginData = {
    userEmail: userMail,
    pass: pass,
  };

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
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
      admin: "/admin",
    };

    const redirectPath = roleRedirectMap[result.role] ?? "/";
    redirect(redirectPath);
  } else {
    return {
      error: true,
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

export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return {
        error: true,
        message: data.message || "שגיאה בשליחת בקשת איפוס סיסמה",
      };
    }

    return { success: true };
  } catch (error) {
    return { error: true, message: "שגיאה בחיבור לשרת" };
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return {
        error: true,
        message: data.message || "שגיאה באיפוס סיסמה",
      };
    }

    return { success: true };
  } catch (error) {
    return { error: true, message: "שגיאה בחיבור לשרת" };
  }
};

export async function updateProfile(
  userId: string,
  formData: ProfileUpdateFormValues,
): Promise<any> {
  try {
    const response = await authFetch(`${BACKEND_URL}/users/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        error: true,
        message: data.message || "שגיאה בעדכון הפרטים",
      };
    }

    // Update session with new user name
    const fullName = `${formData.firstName} ${formData.lastName}`;
    await updateSessionUser({ name: fullName });

    return { success: true };
  } catch (error) {
    return { error: true, message: "שגיאה בחיבור לשרת" };
  }
}

"use server"

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { createSession, updateTokens } from "./session";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    userEmail: formData.get("userEmail"),
    pass: formData.get("pass"),
    passConfirm: formData.get("passConfirm"),
    phoneNum: formData.get("phoneNum"),
    birthDay: formData.get("birthDay")
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors
    }
  }
  
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validationFields.data)
  });

  if (response.ok) {
    redirect("/auth/login")
  } else {
    return {
      message: response.status === 409 ? "קיים משתמש עם כתובת האימייל שבחרת" : response.statusText
    }
  }
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = LoginFormSchema.safeParse({
    userEmail: formData.get("userEmail"),
    pass: formData.get("pass"),
  });

  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors
    }
  }

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validationFields.data)
  });

  if (response.ok) {
    const result = await response.json();

    await createSession({
      user: {
        uid: result.uid,
        name: result.name,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
    redirect("/");
  } else {
    return {
      message: response.status === 401 ? "הפרטים לא נכונים" : response.statusText
    }
  }
}

export const refreshToken = async (oldRefreshToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: oldRefreshToken
      })
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token" + response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();

    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method:"POST",
      body: JSON.stringify({
        accessToken,
        refreshToken
      })
    })

    if (!updateRes.ok)
      throw new Error("Failed to update the tokens")

    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
}
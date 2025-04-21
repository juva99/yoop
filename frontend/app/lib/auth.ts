"use server"

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { createSession } from "./session";

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
    });
    redirect("/");
  } else {
    return {
      message: response.status === 401 ? "הפרטים לא נכונים" : response.statusText
    }
  }
}
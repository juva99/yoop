"use server"

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, SignupFormSchema } from "./type";

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
  }
  else {
    return {
      message: response.status === 409 ? "קיים משתמש עם כתובת האימייל שבחרת" : response.statusText
    }
  }
}
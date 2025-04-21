"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth";

const LoginForm = () => {
  const [state, action] = useActionState(login, undefined);

  return (
    <form action={action}>
      {state?.message && <p className="form_error">{state.message}</p>}

      <div className="form_item">
        <Label htmlFor="userEmail" className="form_label">
          אימייל
        </Label>
        <Input
          type="email"
          id="userEmail"
          name="userEmail"
          placeholder="example@email.com"
          className="input_underscore"
        ></Input>
      </div>
      {state?.error?.userEmail && (
        <p className="form_error">{state.error.userEmail}</p>
      )}

      <div className="form_item">
        <Label htmlFor="pass" className="form_label">
          סיסמא
        </Label>
        <Input
          type="password"
          id="pass"
          name="pass"
          placeholder="••••••••"
          className="input_underscore"
        ></Input>
        <Link
          href={"/auth/signup"}
          className="mr-2 text-sm font-medium text-blue-500 underline hover:text-blue-700"
        >
          שכחת סיסמא?
        </Link>
      </div>
      {state?.error?.pass && <p className="form_error">{state.error.pass}</p>}

      <div className="flex w-full justify-center">
        <SubmitButton className="mt-3 rounded-sm bg-blue-500 px-5 py-5 text-lg font-semibold text-white">
          התחבר
        </SubmitButton>
      </div>
    </form>
  );
};

export default LoginForm;

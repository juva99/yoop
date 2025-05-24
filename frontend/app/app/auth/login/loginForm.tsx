"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { login } from "@/lib/auth";
import Link from "next/link";

import { LoginFormSchema, LoginFormValues } from "@/lib/schemas/login_schema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      userEmail: "",
      pass: "",
    },
  });

  const [formError, setFormError] = useState("");

  const onSubmit = async (values: LoginFormValues) => {
    const formData = new FormData();
    formData.append("userEmail", values.userEmail);
    formData.append("pass", values.pass);
    const result = await login(undefined, formData);
    if (result?.error) {
      setFormError(result.message || "שגיאה בהתחברות");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>אימייל</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סיסמא</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Link href="/auth/forgot" className="text-sm text-blue-600 underline">
            שכחת סיסמה?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-blue-500 py-2 text-white">
          התחבר
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { login } from "@/lib/auth";
import Link from "next/link";
import { TbEyeOff } from "react-icons/tb";
import { TbEyeCheck } from "react-icons/tb";
import { toast } from "sonner";

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

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: LoginFormValues) => {
    values.userEmail = values.userEmail.toLowerCase();
    const result = await login(values.userEmail, values.pass);
    if (result?.error) {
      toast.error(result.message || "שגיאה בהתחברות");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem className="text-right">
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
            <FormItem className="text-right">
              <FormLabel>סיסמא</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <TbEyeCheck /> : <TbEyeOff />}
                  </button>
                </div>
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

        <div className="flex justify-center">
          <Button type="submit" variant={"submit"}>
            התחבר
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;

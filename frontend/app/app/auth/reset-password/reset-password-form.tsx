"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth"; // This function needs to be created
import {
  ResetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/schemas/reset_password_schema";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      pass: "",
      passConfirm: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!resetToken) {
      toast.error("אסימון איפוס סיסמה חסר");
      return;
    }
    try {
      const result = await resetPassword(resetToken, values.pass);
      if (result?.error) {
        toast.error(result.message || "שגיאה באיפוס הסיסמה");
      } else {
        toast.success("הסיסמה אופסה בהצלחה");
        // Optionally redirect the user to the login page
        // window.location.href = "/auth/login";
      }
    } catch (error) {
      toast.error("שגיאה באיפוס הסיסמה");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pass"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>סיסמה חדשה</FormLabel>
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
                    {showPassword ? <FaRegEye /> : <LuEyeClosed />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passConfirm"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>אימות סיסמה חדשה</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" variant={"submit"}>
            אפס סיסמה
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

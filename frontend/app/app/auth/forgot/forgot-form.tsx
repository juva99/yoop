"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/auth";

import { forgotSchema, ForgotSchema } from "@/lib/schemas/forgot_schema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const ForgotPasswordForm = () => {
  const form = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      userEmail: "",
    },
  });

  const onSubmit = async (values: ForgotSchema) => {
    try {
      const result = await forgotPassword(values.userEmail);
      if (result?.error) {
        toast.error(result.message || "שגיאה בשליחת בקשת איפוס סיסמה");
      } else {
        toast.success("אם האימייל קיים במערכת, נשלח אליך קישור לאיפוס סיסמה");
      }
    } catch (error) {
      toast.error("שגיאה בשליחת בקשת איפוס סיסמה");
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
        <div className="flex justify-center">
          <Button type="submit" variant={"submit"}>
            שלח
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;

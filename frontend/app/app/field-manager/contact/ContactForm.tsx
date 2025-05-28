"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React from "react";
import { formSchema } from "@/lib/schemas/manager_signup_schema";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {};

const ContactForm: React.FC<Props> = ({}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNum: "",
      hasCourt: undefined,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/manager-signup/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(
        errorData.message ||
          "אירעה שגיאה בשליחת הפרטים, אנא נסה שוב מאוחר יותר.",
      );
      return;
    }
    const data = await response.json();
    toast.success("הפרטים נשלחו בהצלחה, נחזור אלייך בהקדם!");
    form.reset();
  }
  return (
    <div className="h-full w-full">
      <div className="flex flex-col justify-center gap-1">
        <h1 className="text-center">איזה כיף, עוד מגרשים לאוסף</h1>
        <h2 className="text-center">תשאיר לנו פרטים ונחזור אלייך בהקדם</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-5"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם פרטי</FormLabel>
                <FormControl>
                  <Input
                    placeholder="הקלד שם פרטי"
                    {...field}
                    className="input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם משפחה</FormLabel>
                <FormControl>
                  <Input placeholder="הקלד שם משפחה" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כתובת מייל</FormLabel>
                <FormControl>
                  <Input placeholder="הקלד את המייל שלך" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מספר פלאפון</FormLabel>
                <FormControl>
                  <Input
                    type="phone"
                    placeholder="הקלד מספר פלאפון"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>פרט על המגרש</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="הסבר בכמה מילים על הרקע שלך כמנהל המגרש"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasCourt"
            render={({ field }) => (
              <FormItem className="items-center space-x-2 space-x-reverse">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel htmlFor="terms" className="text-sm leading-none">
                    אני מצהיר שיש בבעלותי/בניהולי מגרש/י ספורט.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="submit">
            שלח
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;

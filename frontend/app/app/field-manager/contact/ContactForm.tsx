"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

type Props = {};

const ContactForm: React.FC<Props> = ({}) => {
  const formSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "שם פרטי חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית" }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: "שם משפחה חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית" }),
    email: z.string().trim().email({ message: "בבקשה הכנס כתובת מייל תקינה" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full max-w-md p-7">
      <div className="mb-15 flex flex-col justify-center gap-3">
        <h1 className="text-title text-3xl">איזה כיף, עוד מגרשים לאוסף</h1>
        <h2 className="text-subtitle text-xl">
          תשאיר לנו פרטים ותקבל מייל הרשמה :)
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">שלח</Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;

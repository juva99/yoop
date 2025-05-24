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

type Props = {};

const ContactForm: React.FC<Props> = ({}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNum: "",
      password: "",
      confirmPassword: "",
      hasCourt: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  console.log(form.getValues());

  return (
    <div className="h-full w-full max-w-md p-7">
      <div className="mb-10 flex flex-col justify-center gap-4">
        <h1 className="text-title text-2xl font-bold">
          איזה כיף, עוד מגרשים לאוסף
        </h1>
        <h2 className="text-subtitle text-xl">
          תשאיר לנו פרטים ונחזור אלייך :)
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>סיסמה</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="הקלד סיסמה" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>סיסמה</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="הקלד סיסמה" {...field} />
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
          <Button
            type="submit"
            className="primary-btn"
            onClick={() => {
              console.log(form.getValues());
            }}
          >
            שלח
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;

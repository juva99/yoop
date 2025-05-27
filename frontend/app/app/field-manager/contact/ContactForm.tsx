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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="h-full w-full p-7">
      <Card>
        <div className="flex flex-col justify-center gap-1 py-4">
          <h2 className="text-center">איזה כיף, עוד מגרשים לאוסף</h2>
          <h3 className="text-center">תשאיר לנו פרטים ונחזור אלייך בהקדם</h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              variant="submit"
              onClick={() => {
                console.log(form.getValues());
              }}
            >
              שלח
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;

import * as React from "react";

import { cn } from "@/lib/utils";
type CardVariant = "default" | "form" | "game" | "friends";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}
function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default:
      "bg-card text-card-foreground border border-gray-100 shadow-sm w-full",
    form: "bg-white h-full text-gray-900 shadow-lg px-8",
    game: "bg-card text-card-foreground border border-gray-100 shadow-sm w-full mt-3",
    friends:
      "max-h-[400px] overflow-y-auto bg-card text-card-foreground border border-gray-100 shadow-sm w-full mt-3",
  };

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-2xl p-4",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

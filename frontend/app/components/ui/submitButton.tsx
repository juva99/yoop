"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  className?: string;
  children: React.ReactNode;
}
const SubmitButton = ({ className, children }:SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit"  aria-disabled={pending} className={className}>
      {pending ? "שולח..." : children}
    </Button>
  )
}

export default SubmitButton
import React from "react";
import ContactForm from "./ContactForm";
import { authFetch } from "@/lib/authFetch";

const Page: React.FC = () => {
  return (
    <div>
      <ContactForm />
    </div>
  );
};

export default Page;

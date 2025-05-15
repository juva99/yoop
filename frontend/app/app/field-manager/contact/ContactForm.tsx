"use client";
import { authFetch } from "@/lib/authFetch";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const ContactForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function sendInput(data: ContactFormData) {
    try {
      console.log(data);

      // const response = await authFetch("/api/contact", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (!response.ok) throw new Error("Failed to send message");

      toast.success("מייל הרשמה בדרך אלייך!");
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (err) {
      toast.error("שליחה נכשלה, נסה שוב");
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: ContactFormData = {
      firstName,
      lastName,
      email,
    };

    sendInput(formData);
  };

  return (
    <div className="px-6 py-10">
      <Toaster position="top-center" />

      <div className="mb-20 flex flex-col justify-center gap-3">
        <h1 className="text-title text-3xl">איזה כיף, עוד מגרשים לאוסף</h1>
        <h2 className="text-subtitle text-xl">
          תשאיר לנו פרטים ותקבל מייל הרשמה :)
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="firstName"
          placeholder="שם פרטי"
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="שם משפחה"
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="primary-btn">
          שלח
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

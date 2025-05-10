"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataSchema } from "@/lib/schemas/create_game_schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import GameInfoStep from "./GameInfoStep";
import FieldInfoStep from "./FieldInfoStep";
import StartTimeStep from "./StartTimeStep";
import EndTimeStep from "./EndTimeStep";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";

export type Inputs = z.infer<typeof FormDataSchema>;
const steps = [
  {
    id: "Step 1",
    name: "Game Info",
    fields: ["date", "gameType", "city", "maxParticipants"],
    component: GameInfoStep,
  },
  {
    id: "Step 2",
    name: "Field Info",
    fields: ["fieldName"],
    component: FieldInfoStep,
  },
  {
    id: "Step 3",
    name: "Start time",
    fields: ["startTime"],
    component: StartTimeStep,
  },
  {
    id: "Step 4",
    name: "End time",
    fields: ["endTime"],
    component: EndTimeStep,
  },
];

export default function CreateGameForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  async function onSubmit(data: z.infer<typeof FormDataSchema>) {
    const session = await getSession();
    const token = session?.accessToken;
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const year = data.date.getFullYear();
    const month = data.date.getMonth();
    const day = data.date.getDate();

    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const startDateObj = new Date(year, month, day, startHour, startMinute);

    const [endHour, endMinute] = data.endTime.split(":").map(Number);
    const endDateObj = new Date(year, month, day, endHour, endMinute);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: data.gameType,
          startDate: startDateObj.toISOString(),
          endDate: endDateObj.toISOString(),
          maxParticipants: data.maxParticipants,
          field: data.fieldName,
        }),
      },
    );

    const result = await response.json();

    form.reset();
    if (response.ok && result.gameId) {
      router.push(`/game/${result.gameId}`);
    } else {
      console.error(
        "Failed to create game or gameId not found in response",
        result,
      );
    }
  }
  type FieldName = keyof Inputs;

  const next = async () => {
    if (currentStep >= steps.length) return;

    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    } else {
      form.handleSubmit(onSubmit)();
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <section className="absolute flex flex-col justify-between p-24">
      {/* steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0">
                  <span className="text-sm font-medium text-sky-600 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {CurrentStepComponent && (
            <motion.div
              key={currentStep}
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CurrentStepComponent form={form as any} />
            </motion.div>
          )}

          {currentStep === steps.length && (
            <>
              <h2 className="text-base leading-7 font-semibold text-gray-900">
                Complete
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Thank you for your submission. The game has been created.
              </p>
            </>
          )}
        </form>
      </Form>

      {/* Navigation */}
      <div className="mt-12 flex justify-between py-12">
        <button
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
          className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        {currentStep < steps.length && (
          <button
            type="button"
            onClick={next}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-300 ring-inset hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentStep === steps.length - 1 ? (
              <span className="flex items-center">
                Finish
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="ml-1 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

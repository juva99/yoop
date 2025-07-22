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
import { useRouter } from "next/navigation";
import { Form } from "../ui/form";
import { authFetch } from "@/lib/authFetch";
import { set } from "date-fns";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  async function onSubmit(data: z.infer<typeof FormDataSchema>) {
    setIsSubmitting(true);

    const year = data.date.getFullYear();
    const month = data.date.getMonth();
    const day = data.date.getDate();

    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const startDateObj = new Date(year, month, day, startHour, startMinute);

    const [endHour, endMinute] = data.endTime.split(":").map(Number);
    const endDateObj = new Date(year, month, day, endHour, endMinute);

    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <Card>
      {currentStep !== steps.length && <h1>יצירת משחק חדש</h1>}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {CurrentStepComponent && (
            <motion.div
              key={currentStep}
              className="flex flex-col justify-center space-y-5"
            >
              <CurrentStepComponent form={form as any} />
            </motion.div>
          )}

          {currentStep === steps.length && (
            <>
              <h1 className="text-center">המשחק נוצר בהצלחה</h1>
              <h2 className="text-center">מיד תעבור לעמוד המשחק</h2>
            </>
          )}
        </form>
      </Form>

      {/* Navigation */}
      <div className="flex justify-between py-12">
        {!isSubmitting && (
          <Button type="button" onClick={prev} disabled={currentStep === 0}>
            חזור
          </Button>
        )}
        {currentStep < steps.length && (
          <Button type="button" className="bg-title" onClick={next}>
            {currentStep === steps.length - 1 ? (
              <span>סיים</span>
            ) : (
              <span>המשך</span>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

import React from "react";
import { Field } from "@/app/types/Field";
import FieldCard from "./FieldCard";

type Props = {
  fields: Field[];
};

const Fields: React.FC<Props> = ({ fields }) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-center">המגרשים שלך</h1>
      <div className="flex w-full flex-col items-center gap-6">
        {fields.length === 0 ? (
          <p className="w-full max-w-md rounded-md border bg-gray-200 py-8 text-center text-lg text-gray-400 shadow-md">
            אין מגרשים להצגה
          </p>
        ) : (
          fields.map((field) => <FieldCard key={field.fieldId} field={field} />)
        )}
      </div>
    </div>
  );
};

export default Fields;

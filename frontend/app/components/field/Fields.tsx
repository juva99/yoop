import React from "react";
import { Field } from "@/app/types/Field";
import FieldCard from "./FieldCard";

type Props = {
  fields: Field[];
};

const Fields: React.FC<Props> = ({ fields }) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mt-4 mb-4 text-right text-2xl font-bold text-[#002366]">
        המגרשים שלך
      </h1>

      <div className="flex w-full flex-col items-center gap-6">
        {fields.length === 0 ? (
          <p className="w-full max-w-md rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm">
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

import React from "react";
import { Field } from "@/app/types/Field";
import FieldCard from "./FieldCard";

type Props = {
  fields: Field[];
};

const Fields: React.FC<Props> = ({ fields }) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-[#002366] text-2xl font-bold mb-4 mt-4 text-right">
        המגרשים שלך
      </h1>

      <div className="w-full flex flex-col items-center gap-6">
        {fields.length === 0 ? (
          <p className="rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm w-full max-w-md">
            אין מגרשים להצגה
          </p>
        ) : (
          fields.map((field) => (
            <FieldCard key={field.fieldId} field={field} />
          ))
        )}
      </div>
    </div>
  );
};

export default Fields;

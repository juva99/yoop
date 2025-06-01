import React from "react";
import { Field } from "@/app/types/Field";
import FieldCard from "./FieldCard";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";

type Props = {
  fields: Field[];
};

const Fields: React.FC<Props> = ({ fields }) => {
  return (
    <div className="p-4">
      <div className="flex w-full flex-col items-center gap-6">
        <Card className="flex flex-col">
          <h1 className="text-center">המגרשים שלך</h1>

          {fields.length === 0 ? (
            <div>
              <p>אין מגרשים להצגה</p>
              <Link href={"/field-manager/field/create"}>
                <Button variant={"submit"}>הוסף מגרש</Button>
              </Link>
            </div>
          ) : (
            <div className="scrollbar-none max-h-[600px] overflow-y-scroll">
              {fields.map((field, idx) => (
                <FieldCard
                  key={field.fieldId}
                  field={field}
                  border={idx < fields.length - 1}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Fields;

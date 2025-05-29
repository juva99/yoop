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
        {fields.length === 0 ? (
          <Card className="flex flex-col items-center gap-3">
            <h1 className="text-center">המגרשים שלך</h1>
            <p>אין מגרשים להצגה</p>
            <Link href={"/field-manager/field/create"}>
              <Button variant={"submit"}>הוסף מגרש</Button>
            </Link>
          </Card>
        ) : (
          fields.map((field) => <FieldCard key={field.fieldId} field={field} />)
        )}
      </div>
    </div>
  );
};

export default Fields;

"use client";
import React from "react";
import { TiDelete } from "react-icons/ti";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field } from "@/app/types/Field";
type Props = {
  field: Field;
};

const DeleteField: React.FC<Props> = ({ field }) => {
  const deleteField = async () => {
    console.log("פה נחבר את המחיקה בתכלס של: " + field.fieldName);
  };
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>
            <TiDelete color="gray" size={18} />{" "}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl" className="text-sm">
          <AlertDialogTitle>
            <p>בחרת למחוק את {field.fieldName}</p>
          </AlertDialogTitle>

          <p className="text-xl font-bold">האם אתה בטוח?</p>
          <p className="text-sm">כל המשחקים במגרש יבוטלו אוטומטית</p>
          <AlertDialogFooter className="flex justify-end gap-2 pt-4">
            <AlertDialogCancel className="px-4 py-1">לא</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 px-4 py-1 text-white hover:bg-red-700"
              onClick={() => deleteField()}
            >
              כן
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteField;

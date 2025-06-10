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
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
type Props = {
  field: Field;
};

const DeleteField: React.FC<Props> = ({ field }) => {
  const deleteField = async () => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${field.fieldId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "אירעה שגיאה, נסה שוב מאוחר יותר.");
        return;
      }

      toast.success("המגרש נמחק בהצלחה");
    } catch (error) {
      toast.error("אירעה שגיאה");
    }
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

import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  children: React.ReactNode;
  message: string;
  onClick: () => void;
};

const AlertPopup = ({ children, message, onClick }: Props) => {
  return (
    <div>
      {" "}
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent dir="rtl" className="text-sm">
          <AlertDialogTitle>
            <p>{message}</p>{" "}
          </AlertDialogTitle>
          <p className="text-xl font-bold">האם אתה בטוח?</p>
          <AlertDialogFooter className="flex justify-end gap-2 pt-4">
            <AlertDialogCancel className="px-4 py-1">לא</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 px-4 py-1 text-white hover:bg-red-700"
              onClick={onClick}
            >
              כן
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertPopup;

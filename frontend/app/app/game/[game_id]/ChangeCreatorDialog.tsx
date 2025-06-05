"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  onConfirm: () => void;
}

const ChangeCreatorDialog: React.FC<Props> = ({ onConfirm }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          <img
            src="/add_creator.png"
            alt="Make Creator"
            width={22}
            height={22}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>להעביר בעלות?</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך להפוך שחקן זה לבעלים החדש של המשחק?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>אישור</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeCreatorDialog;

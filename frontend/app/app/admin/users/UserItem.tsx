"use client";

import { User } from "@/app/types/User";
import Link from "next/link";
import { FaUserXmark } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@/app/enums/role.enum";

type Props = {
  user: User;
  border?: boolean;
};

const formatPhoneNumber = (phoneNum: string) => `972${phoneNum.substring(1)}`;

const UserItem: React.FC<Props> = ({ user, border = true }) => {
  const router = useRouter();

  const handleDeleteUser = async () => {
    if (user.role === Role.USER) {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.uid}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        toast.error("שגיאה במחיקת המשתמש");
      } else {
        toast.success("המשתמש נמחק בהצלחה");
        router.refresh();
      }
    } else {
      toast.error("לא ניתן למחוק מנהל מגרש, קיימים משחקים פתוחים");
    }
  };

  return (
    <div
      key={user.uid}
      className={`py-3 ${border ? "border-b border-gray-100" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button>
              <FaUserXmark size={15} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl" className="text-sm">
            <AlertDialogTitle>
              בחרת למחוק את {user.firstName} {user.lastName}
            </AlertDialogTitle>

            <p>האם אתה בטוח שאתה רוצה למחוק אותו?</p>
            <AlertDialogFooter className="flex justify-end gap-2 pt-4">
              <AlertDialogCancel className="px-4 py-1">לא</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 px-4 py-1 text-white hover:bg-red-700"
                onClick={() => handleDeleteUser()}
              >
                כן
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <p>עיר:</p>
          {user.address ? <p>{user.address}</p> : <p>אין כתובת במערכת</p>}
        </div>
        <div className="flex items-center gap-2">
          <p>מספר פלאפון:</p>
          {user.phoneNum ? (
            <p>{user.phoneNum}</p>
          ) : (
            <p>אין מספר פלאפון במערכת</p>
          )}
          {user.phoneNum && (
            <Link
              href={`https://wa.me/${formatPhoneNumber(user.phoneNum)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={15} className="text-[#25D366]" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserItem;

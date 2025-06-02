"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { setGameCreator } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  gameId: string;
  uid: string;
  icon: ReactNode;
}

export default function ChangeGameCreatorButton(prop: Props) {
  const router = useRouter();

  async function clickChange({ gameId, uid }: Props) {
    const res = await setGameCreator(gameId, uid);

    if (!res.ok) {
      toast.error(res.message || "אירעה שגיאה");
    } else {
      toast.success(res.message);
    }
    router.refresh();
  }

  return <button onClick={() => clickChange(prop)}>{prop.icon}</button>;
}

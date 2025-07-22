"use client";

import { changeParticipationStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  gameId: string;
  uid: string;
  status: ParticipationStatus;
  icon: ReactNode;
}

export default function ChangeParticipationButton(prop: Props) {
  const router = useRouter();

  async function clickChange({ gameId, uid, status }: Props) {
    const res = await changeParticipationStatus(gameId, uid, status);

    if (!res.ok) {
      toast.error(res.message || "אירעה שגיאה");
    } else {
      toast.success(res.message);
    }

    router.refresh();
  }

  return <button onClick={() => clickChange(prop)}>{prop.icon}</button>;
}

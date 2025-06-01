"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { setGameCreator } from "@/lib/actions";

interface Props {
  gameId: string;
  uid: string;
  icon: ReactNode;
}

export default function ChangeGameCreatorButton(prop: Props) {
  const router = useRouter();

  async function clickChange({ gameId, uid }: Props) {
    await setGameCreator(gameId, uid,);
    router.refresh();
  }

  return <button onClick={() => clickChange(prop)}>{prop.icon}</button>;
}

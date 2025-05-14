import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import MapView from "@/components/MapView";
import Search from "@/components/searchComponents/Search";
import SearchGame from "@/components/searchComponents/SearchGame";
import NotificationsButton from "@/components/ui/NotificationsButton";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/mygames`,
  );
  const data = await res.json();

  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    redirect("/auth/login");
  }

  const userName = session.user.name;

  return (
    <div className="mb-10 flex flex-col gap-6 p-4 pb-6">
      <div className="mb-2 flex flex-row items-center justify-between">
        <p className="text-title text-2xl font-bold">
          היי {userName.split(" ")[0]},{" "}
        </p>
        <div className="flex gap-3">
          <NotificationsButton />
          <Link
            href={"/api/auth/signout"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
          >
            התנתק
          </Link>
        </div>
      </div>
      <div className="rounded-2xl shadow-xl">
        <span className="text-subtitle mb-2 text-2xl">משחקים עתידיים</span>
        <FutureGames games={data} />
      </div>
      <Search />
    </div>
  );
}

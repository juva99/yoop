import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import MapView from "@/components/MapView";
import Search from "@/components/searchComponents/Search";
import SearchGame from "@/components/searchComponents/SearchGame";
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
      <div className="mb-2 flex flex-row items-center">
        <p className="text-title text-2xl font-bold">היי {userName.split(' ')[0]}, </p>
        <Link
          href={"/api/auth/signout"}
          className="mr-auto rounded bg-red-500 px-4 py-2 font-bold text-white transition-colors hover:bg-red-600"
        >
          התנתק
        </Link>
      </div>
      <div className="rounded-2xl shadow-xl">
        <FutureGames games={data} />
      </div>
      <Search />
    </div>
  );
}

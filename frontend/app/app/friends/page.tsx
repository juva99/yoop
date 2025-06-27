import { authFetch } from "@/lib/authFetch";
import { User } from "@/app/types/User";
import { getSession } from "@/lib/session";
import FriendList from "@/components/friends/FriendList";
import SearchFriends from "@/components/friends/SearchFriends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    return null;
  }

  const userId = session.user.uid;
  const query = (await searchParams).query;

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search_friends/${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const friends = await response.json();

  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
  );
  const friendRelations = await friendsResponse.json();

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-3xl font-bold text-transparent">
            חברים
          </h1>
          <p className="mt-2 text-gray-600">
            נהל את החברים שלך וחפש חברים חדשים
          </p>
        </div>

        {/* My Friends */}
        <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <FriendList currentUserUid={userId} relations={friendRelations} />
          </CardContent>
        </Card>

        {/* Search Friends */}
        <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <SearchFriends
              friends={friends}
              userId={userId}
              initialQuery={query as string}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

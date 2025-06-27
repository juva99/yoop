import { authFetch } from "@/lib/authFetch";
import { User } from "@/app/types/User";
import { getSession } from "@/lib/session";
import FriendList from "@/components/friends/FriendList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { PiMagnifyingGlassThin } from "react-icons/pi";
import Form from "next/form";
import Friend from "@/components/friends/Friend";

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const userId = session!.user.uid;
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
    <div className="min-h-screen p-2 sm:p-4">
      <div className="mx-auto max-w-md space-y-4 sm:max-w-2xl sm:space-y-6">
        {/* Header */}
        <div className="px-2 text-center">
          <h1 className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            חברים
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
            נהל את החברים שלך וחפש חברים חדשים
          </p>
        </div>

        {/* My Friends */}
        <Card className="mx-2 border-0 bg-white/70 shadow-lg backdrop-blur-sm sm:mx-0">
          <CardContent className="p-3 sm:p-6">
            <CardHeader className="p-0 pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-gray-900 sm:text-base">
                  רשימת החברים
                </span>
              </div>
            </CardHeader>
            <FriendList currentUserUid={userId} relations={friendRelations} />
          </CardContent>
        </Card>

        {/* Search Friends */}
        <Card className="mx-2 border-0 bg-white/70 shadow-lg backdrop-blur-sm sm:mx-0">
          <CardContent className="p-3 sm:p-6">
            <Form action="/friends" scroll={false}>
              <div className="input-wrapper border-title mt-5 mb-5 flex justify-between border-b-1 py-1">
                <input
                  type="text"
                  name="query"
                  placeholder="הקלד שם"
                  defaultValue={query}
                  className="border-none bg-white bg-none shadow-none focus:border-none focus:ring-0 focus:outline-none"
                />

                <button type="submit">
                  <PiMagnifyingGlassThin />
                </button>
              </div>
            </Form>
            {/* Search Results */}
            <div className="space-y-4">
              {friends.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>תוצאות החיפוש</span>
                  </div>
                  <div className="grid gap-3">
                    {friends.map((friend: User) => (
                      <div
                        key={friend.uid}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
                      >
                        <Friend friend={friend} action="add" userId={userId} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : query ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    לא נמצאו תוצאות
                  </h3>
                  <p className="mb-4 text-gray-600">
                    לא נמצאו חברים התואמים לחיפוש "{query}"
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                    <Search className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    חפש חברים חדשים
                  </h3>
                  <p className="text-gray-600">
                    השתמש בחיפוש למעלה כדי למצוא חברים חדשים להוסיף
                  </p>
                </div>
              )}
            </div>{" "}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

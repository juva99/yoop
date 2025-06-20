import Friend from "@/components/friends/Friend";
import Form from "next/form";
import { authFetch } from "@/lib/authFetch";
import { User } from "@/app/types/User";
import { PiMagnifyingGlassThin } from "react-icons/pi";
import { getSession } from "@/lib/session";
import FriendList from "@/components/friends/FriendList";
import { Card } from "@/components/ui/card";

export default async function SearchPage({
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
    <div className="flex flex-col gap-5 px-5">
      <Card variant="friends">
        <FriendList currentUserUid={userId} relations={friendRelations} />
      </Card>

      <Card>
        <h1>הוספת חברים</h1>
        <Form action="/friends">
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

        <div className="scrollbar-none overflow-y-scroll">
          {friends.length > 0 ? (
            friends.map((friend: User) => (
              <Friend key={friend.uid} friend={friend} action="add" />
            ))
          ) : query ? (
            <p>אין תוצאות</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

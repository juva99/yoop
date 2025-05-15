import Friend from "@/components/friends/Friend";
import Form from "next/form";
import { authFetch } from "@/lib/authFetch";
import { Button } from "@/components/ui/button";
import FriendReq from "@/components/friends/FriendReq";
import { User } from "@/app/types/User";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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

  return (
    <div>
      <Form action="/friends/search">
        <input
          type="text"
          name="query"
          placeholder="Search friends"
          defaultValue={query}
        />
        <Button type="submit">Search</Button>
      </Form>

      <div>
        {friends.map((friend: User, i: number) => (
          <Friend key={friend.uid} friend={friend} />
        ))}
      </div>
    </div>
  );
}

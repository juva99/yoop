import Friend from "@/components/friends/Friend";
import Form from "next/form";
import { authFetch } from "@/lib/authFetch";
import { User } from "@/app/types/User";
import { PiMagnifyingGlassThin } from "react-icons/pi";

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
    <div className="h-[80vh] bg-[url('/search-friends-background.png')] bg-cover bg-top bg-no-repeat px-7 py-10">
      <div className="h-[400px] rounded-3xl bg-white px-8 py-5">
        <h1 className="text-title font-md text-center text-3xl">הוספת חברים</h1>
        <Form action="/friends/search">
          <div className="input-wrapper border-title mt-5 mb-5 flex justify-between border-b-1 py-1">
            <input
              type="text"
              name="query"
              className="bg-transparent outline-none"
              placeholder="חפש חבר"
              defaultValue={query}
            />
            <button type="submit">
              <PiMagnifyingGlassThin />
            </button>
          </div>
        </Form>

        <div className="scrollbar-none max-h-[300px] overflow-y-scroll">
          {friends.length ? (
            friends.map((friend: User, i: number) => (
              <Friend key={friend.uid} friend={friend} action="add" />
            ))
          ) : (
            <p>אין תוצאות</p>
          )}
        </div>
      </div>
    </div>
  );
}

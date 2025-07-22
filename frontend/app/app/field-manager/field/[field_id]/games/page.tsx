import { authFetch } from "@/lib/authFetch";
import { Field } from "@/app/types/Field";
import FieldGameList from "@/components/field-manager/future-games/FieldGameList";
import { Game } from "@/app/types/Game";

type Props = {
  params: Promise<{
    field_id: string;
  }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { field_id } = await params;

  const fieldResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${field_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const field: Field = await fieldResponse.json();

  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${field_id}/allGames`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  let games: Game[] = [];
  if (res.ok) {
    games = await res.json();
  }

  return (
    <div className="flex flex-col gap-y-3 px-5 py-10">
      <h1>משחקים ב{field.fieldName}</h1>
      <FieldGameList games={games} />
    </div>
  );
};

export default Page;

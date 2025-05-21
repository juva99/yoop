import { authFetch } from "@/lib/authFetch";
import { Field } from "@/app/types/Field";
import FieldGameList from "@/components/gameManager/futureGames/FieldGameList";

type Props = {
  params: {
    field_id: string;
  };
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

  return (
    <div className="p-5">
      <h1 className="text-title mb-6 text-2xl font-bold">
        משחקים ב{field.fieldName}
      </h1>
      <FieldGameList fieldId={field.fieldId} />
    </div>
  );
};

export default Page;

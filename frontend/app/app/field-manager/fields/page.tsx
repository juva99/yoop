import { Field } from "@/app/types/Field";
import Fields from "@/components/fieldManager/Fields";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";

const FieldsPage = async () => {
  let fields: Field[] = [];

  const session = await getSession();
  const userId = session?.user.uid;
  try {
    const fieldsRes = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${userId}/allFields`,
    );
    fields = await fieldsRes.json();
  } catch (error) {
    console.error(" שגיאה :", error);
  }

  return (
    <div className="h-full px-7 py-5">
      <Fields fields={fields} />
    </div>
  );
};

export default FieldsPage;

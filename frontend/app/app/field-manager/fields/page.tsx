import { Field } from "@/app/types/Field";
import Fields from "@/components/fieldManager/Fields";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { User } from "@/app/types/User";

const FieldsPage = async () => {
  let fields: Field[] = [];
  let user: User | null = null;

  try {
    const session = await getSession();
    if (!session?.user?.uid) {
      console.error("Invalid session or user credentials");
    } else {
      const userId = session.user.uid;

      const userRes = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
      );
      user = await userRes.json();

      const fieldsRes = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${userId}/allFields`,
      );
      fields = await fieldsRes.json();
    }
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

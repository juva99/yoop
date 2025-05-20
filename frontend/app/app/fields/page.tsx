import { Field } from "@/app/types/Field";
import Fields from "@/components/field/Fields";
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
      console.log("User details: ", user);

      const fieldsRes = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${userId}/allFields`,
      );

      if (fieldsRes.ok) {
        fields = await fieldsRes.json();
        console.log(" Fields: ", fields);
      } else {
        console.error(" שגיאה בשליפת מגרשים");
      }
    }
  } catch (error) {
    console.error(" שגיאה :", error);
  }

  return (
    <div className="w-full p-4">
      <Fields fields={fields} />
    </div>
  );
};

export default FieldsPage;

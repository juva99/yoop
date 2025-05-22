import { Role } from "@/app/enums/role.enum";
import CreateFieldForm from "@/components/create-field/create-field-form";
import { getSession } from "@/lib/session";
import React from "react";

const page = async () => {
  const session = await getSession();
  if (!session) {
    return <div>Please log in to create a field.</div>;
  }
  //   if (session.user.role !== Role.FIELD_MANAGER) {
  //     return <div>You do not have permission to create a field.</div>;
  //   }

  return (
    <div>
      <CreateFieldForm />
    </div>
  );
};

export default page;

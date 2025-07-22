import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { authFetch } from "@/lib/authFetch";
import { User } from "@/app/types/User";
import UserItem from "../../../components/admin/UserItem";
import { Role } from "@/app/enums/role.enum";

const page: React.FC = async () => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const users = await response.json();

  const players: User[] = users.filter((u: User) => u.role === Role.USER);
  const managers: User[] = users.filter(
    (u: User) => u.role === Role.FIELD_MANAGER,
  );
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h2 className="text-center">ניהול משתמשים</h2>
      <Tabs defaultValue="players" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="players">שחקנים ({players.length})</TabsTrigger>
          <TabsTrigger value="managers">
            מנהלי מגרשים ({managers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players">
          {players.length === 0 ? (
            <Card className="p-4 text-center">לא נמצאו שחקנים</Card>
          ) : (
            <Card className="scrollbar-none max-h-[700px] overflow-y-scroll">
              {" "}
              {players.map((user: User, idx) => (
                <UserItem
                  key={user.uid}
                  user={user}
                  border={idx < players.length - 1}
                />
              ))}
            </Card>
          )}
        </TabsContent>
        <TabsContent value="managers">
          {managers.length === 0 ? (
            <Card className="p-4 text-center">לא נמצאו מנהלים</Card>
          ) : (
            <Card className="scrollbar-none max-h-[700px] overflow-y-scroll">
              {" "}
              {managers.map((user: User, idx) => (
                <UserItem
                  key={user.uid}
                  user={user}
                  border={idx < players.length - 1}
                />
              ))}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;

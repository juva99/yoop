import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Group } from "../types/Group";
import GroupItem from "./GroupItem";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";

const getMyGroups = async (): Promise<Group[]> => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/mygroups`,
  );

  if (!response.ok) {
    console.error("Failed to fetch my groups:", response.statusText);
    return [];
  }

  const groups = await response.json();

  return groups;
};

const Groups = async () => {
  const session = await getSession();
  const userId = session!.user.uid;
  const groups = await getMyGroups();

  const validGroups = groups.filter((group) => group && group.groupMembers);

  const managedGroups = validGroups.filter((group) =>
    group.groupMembers.some(
      (member) => member.user.uid === userId && member.isManager,
    ),
  );

  return (
    <div>
      <Tabs defaultValue="groups" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">הקבוצות שלי</TabsTrigger>
          <TabsTrigger value="managed">קבוצות בניהולי</TabsTrigger>
        </TabsList>

        <TabsContent value="managed">
          {managedGroups.length === 0 ? (
            <p className="py-2 text-center">אתה לא מנהל אף קבוצה</p>
          ) : (
            <div className="scrollbar-none flex max-h-[calc(100vh-200px)] flex-col gap-3 overflow-y-auto pt-4">
              {managedGroups.map((group, index) => (
                <GroupItem
                  key={"g" + index}
                  group={group}
                  userId={userId}
                  isManager={group.groupMembers.some(
                    (member) => member.user.uid === userId && member.isManager,
                  )}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups">
          {validGroups.length === 0 ? (
            <p className="py-2 text-center">אתה לא חבר באף קבוצה</p>
          ) : (
            <div className="scrollbar-none flex max-h-[calc(100vh-200px)] flex-col gap-3 overflow-y-auto pt-4">
              {validGroups.map((group, index) => (
                <GroupItem
                  key={index}
                  group={group}
                  userId={userId}
                  isManager={group.groupMembers.some(
                    (member) => member.user.uid === userId && member.isManager,
                  )}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Groups;

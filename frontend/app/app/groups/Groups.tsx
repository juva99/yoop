import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Group } from "../types/Group";
import GroupItem from "./GroupItem";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

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
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <Tabs defaultValue="groups" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
          >
            הקבוצות שלי
          </TabsTrigger>
          <TabsTrigger
            value="managed"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
          >
            קבוצות בניהולי
          </TabsTrigger>
        </TabsList>

        <TabsContent value="managed" className="mt-6">
          {managedGroups.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <AiOutlineUsergroupAdd className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                אין קבוצות בניהולך
              </h3>
              <p className="text-gray-600">אתה לא מנהל אף קבוצה כרגע</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managedGroups.map((group, index) => (
                <div
                  key={"g" + index}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <GroupItem
                    group={group}
                    userId={userId}
                    isManager={group.groupMembers.some(
                      (member) =>
                        member.user.uid === userId && member.isManager,
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          {validGroups.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <AiOutlineUsergroupAdd className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                אין לך קבוצות
              </h3>
              <p className="text-gray-600">אתה לא חבר באף קבוצה כרגע</p>
            </div>
          ) : (
            <div className="space-y-4">
              {validGroups.map((group, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <GroupItem
                    group={group}
                    userId={userId}
                    isManager={group.groupMembers.some(
                      (member) =>
                        member.user.uid === userId && member.isManager,
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Groups;

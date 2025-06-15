"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
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

const Groups = () => {
  const [managedGroups, setManagedGroups] = useState<Group[]>([]);
  const [groups, setdGroups] = useState<Group[]>([]);
  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    const initialFetch = async () => {
      const session = await getSession();
      setUserId(session!.user.uid);
      const groupList = await getMyGroups();
      setdGroups(groupList);
    };

    initialFetch();
  }, []);

  return (
    <div>
      <Tabs defaultValue="groups" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">הקבוצות שלי</TabsTrigger>
          <TabsTrigger value="managed">קבוצות בניהולי</TabsTrigger>
        </TabsList>

        <TabsContent value="managed">
          {managedGroups.length === 0 ? (
            <p className="h-30 text-center">אתה לא מנהל אף קבוצה</p>
          ) : (
            <div className="flex flex-col gap-3 pt-4">
              {managedGroups.map((group, index) => (
                <GroupItem key={"g" + index} group={group} userId={userId} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups">
          {groups.length === 0 ? (
            <p className="h-30 text-center">אתה לא חבר באף קבוצה</p>
          ) : (
            <div className="flex flex-col gap-3 pt-4">
              {groups.map((group, index) => (
                <GroupItem key={index} group={group} userId={userId} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Groups;

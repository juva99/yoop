"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Group } from "../types/Group";
import { GameType } from "../enums/game-type.enum";
import GroupItem from "./GroupItem";
const groupList: Group[] = [
  {
    groupId: "g1",
    groupName: "קבוצה סבבה",
    gameTypes: [GameType.BasketBall],
    groupMembers: [],
  },
  {
    groupId: "g2",
    groupName: "קבוצה אחלה",
    gameTypes: [GameType.FootBall],
    groupMembers: [],
  },
];
const Groups = () => {
  const [managedGroups, setManagedGroups] = useState<Group[]>(groupList);
  const [groups, setdGroups] = useState<Group[]>(groupList);

  //   useEffect(() => {
  //     (async () => {
  //       const session = await getSession();

  //       const currUserUID = session!.user.uid;
  //       //const groups =

  //       setManagedGroup(
  //         groups.filter((group) => game.creator.uid === currUserUID),
  //       );
  //     })();
  //   }, []);

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
                <GroupItem key={"g" + index} group={group} />
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
                <GroupItem key={index} group={group} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Groups;

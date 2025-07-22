"use client";
import { FaUserPlus } from "react-icons/fa6";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/app/types/User";
import { Group } from "@/app/types/Group";
import { inviteFriendsToGame, inviteGroupToGame } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { GameType } from "@/app/enums/game-type.enum";

interface InviteDialogProps {
  gameId: string;
  friends: User[];
  groups: Group[];
  playersInGame: string[]; // UIDs of players already in the game
}

const InviteDialog: React.FC<InviteDialogProps> = ({
  gameId,
  friends,
  groups,
  playersInGame,
}) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const handleInviteFriends = async () => {
    if (selectedFriends.length === 0) {
      toast.error("אנא בחר חברים להזמנה");
      return;
    }

    setIsLoading(true);
    try {
      const result = await inviteFriendsToGame(gameId, selectedFriends);
      if (result.ok) {
        toast.success(result.message);
        setSelectedFriends([]);
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("שגיאה בהזמנת חברים");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteGroups = async () => {
    if (selectedGroups.length === 0) {
      toast.error("אנא בחר קבוצות להזמנה");
      return;
    }

    setIsLoading(true);
    try {
      for (const groupId of selectedGroups) {
        const result = await inviteGroupToGame(gameId, groupId);
        if (!result.ok) {
          toast.error(result.message);
          setIsLoading(false);
          return;
        }
      }
      toast.success("הקבוצות הוזמנו בהצלחה!");
      setSelectedGroups([]);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("שגיאה בהזמנת קבוצות");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out friends who are already in the game
  const availableFriends = friends.filter(
    (friend) => !playersInGame.includes(friend.uid),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center has-[>svg]:px-0">
          <FaUserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הזמן שחקנים למשחק</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="friends" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">חברים</TabsTrigger>
            <TabsTrigger value="groups">קבוצות</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {availableFriends.length === 0 ? (
                <p className="text-center text-gray-500">אין חברים זמינים</p>
              ) : (
                availableFriends.map((friend) => (
                  <div
                    key={friend.uid}
                    className="flex cursor-pointer items-center justify-between rounded border p-2 transition-colors hover:bg-gray-50"
                    onClick={() => handleFriendToggle(friend.uid)}
                  >
                    <div
                      className="flex items-center gap-2"
                      onClick={() => {
                        selectedFriends.includes(friend.uid);
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${friend.uid}`}
                          alt={friend.firstName}
                        />
                        <AvatarFallback>
                          {friend.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {friend.firstName} {friend.lastName}
                      </span>
                    </div>
                    <Checkbox
                      checked={selectedFriends.includes(friend.uid)}
                      onCheckedChange={() => handleFriendToggle(friend.uid)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))
              )}
            </div>
            <Button
              onClick={handleInviteFriends}
              disabled={isLoading || selectedFriends.length === 0}
              className="w-full"
            >
              {isLoading ? "שולח הזמנות..." : "הזמן חברים נבחרים"}
            </Button>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {groups.length === 0 ? (
                <p className="text-center text-gray-500">אין קבוצות</p>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.groupId}
                    className="flex items-center gap-2 rounded border p-2"
                    onClick={() => {
                      handleGroupToggle(group.groupId);
                    }}
                  >
                    <Checkbox
                      checked={selectedGroups.includes(group.groupId)}
                      onCheckedChange={() => handleGroupToggle(group.groupId)}
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {group.gameTypes.map((type, index) =>
                          type === GameType.BasketBall ? (
                            <PiBasketball key={index} />
                          ) : (
                            <PiSoccerBall key={index} />
                          ),
                        )}
                      </div>
                      <span>{group.groupName}</span>
                      <span className="text-sm text-gray-500">
                        ({group.groupMembers.length} חברים)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              onClick={handleInviteGroups}
              disabled={isLoading || selectedGroups.length === 0}
              className="w-full"
            >
              {isLoading ? "שולח הזמנות..." : "הזמן קבוצות נבחרות"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;

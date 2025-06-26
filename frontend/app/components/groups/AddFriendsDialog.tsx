"use client";
import { FaUserPlus } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/app/types/User";
import { Group } from "@/app/types/Group";
import { addFriendsToGroup, getMyFriends } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface InviteDialogProps {
  group: Group;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ group }) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      const friendList = await getMyFriends();
      setFriends(friendList);
    };
    fetchFriends();
  }, []);

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleInviteFriends = async () => {
    if (selectedFriends.length === 0) {
      toast.error("אנא בחר חברים להזמנה");
      return;
    }
    console.log("Inviting friends:", selectedFriends);

    setIsLoading(true);
    try {
      const result = await addFriendsToGroup(selectedFriends, group.groupId);
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

  // Filter out friends who are already in the game
  const playersInGroup = group.groupMembers.map((member) => member.user.uid);
  const availableFriends = friends.filter(
    (friend) => !playersInGroup.includes(friend.uid),
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
          <DialogTitle> הוסף חברים לקבוצה</DialogTitle>
        </DialogHeader>

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
          {isLoading ? " מוסיף חברים..." : "הזמן חברים נבחרים"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;

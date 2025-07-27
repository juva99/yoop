import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FriendList from "@/components/friends/FriendList";
import { FriendRelation } from "@/app/types/friend-relation";
import { User } from "@/app/types/User";

// Mock the dependencies
jest.mock("@/lib/authFetch", () => ({
  authFetch: jest.fn(),
}));

jest.mock("@/components/friends/Friend", () => {
  return function MockFriend({ friend, action, onClick }: any) {
    return (
      <div data-testid="friend-component" onClick={onClick}>
        <div>
          Friend: {friend.firstName} {friend.lastName}
        </div>
        <div>Action: {action}</div>
        <button onClick={onClick}>Remove Friend</button>
      </div>
    );
  };
});

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";

const mockAuthFetch = authFetch as jest.MockedFunction<typeof authFetch>;
const mockToast = toast as jest.Mocked<typeof toast>;

const currentUser: User = {
  uid: "current-user-123",
  firstName: "דני",
  lastName: "כהן",
  userEmail: "danny@example.com",
  birthDay: new Date("1995-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

const friend1: User = {
  uid: "friend-1",
  firstName: "יוסי",
  lastName: "לוי",
  userEmail: "yossi@example.com",
  birthDay: new Date("1992-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

const friend2: User = {
  uid: "friend-2",
  firstName: "מיכל",
  lastName: "אברהם",
  userEmail: "michal@example.com",
  birthDay: new Date("1993-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

const mockRelations: FriendRelation[] = [
  {
    id: "relation-1",
    user1: currentUser,
    user2: friend1,
    status: "accepted",
  },
  {
    id: "relation-2",
    user1: friend2,
    user2: currentUser,
    status: "accepted",
  },
];

describe("FriendList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders friend list with correct friends", () => {
    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    expect(screen.getByText("Friend: יוסי לוי")).toBeInTheDocument();
    expect(screen.getByText("Friend: מיכל אברהם")).toBeInTheDocument();
    expect(screen.getAllByTestId("friend-component")).toHaveLength(2);
  });

  it("filters friends correctly when current user is user1", () => {
    const relationsWithCurrentAsUser1 = [
      {
        id: "relation-1",
        user1: currentUser,
        user2: friend1,
        status: "accepted" as const,
      },
    ];

    render(
      <FriendList
        currentUserUid={currentUser.uid}
        relations={relationsWithCurrentAsUser1}
      />,
    );

    expect(screen.getByText("Friend: יוסי לוי")).toBeInTheDocument();
    expect(screen.getAllByTestId("friend-component")).toHaveLength(1);
  });

  it("filters friends correctly when current user is user2", () => {
    const relationsWithCurrentAsUser2 = [
      {
        id: "relation-1",
        user1: friend1,
        user2: currentUser,
        status: "accepted" as const,
      },
    ];

    render(
      <FriendList
        currentUserUid={currentUser.uid}
        relations={relationsWithCurrentAsUser2}
      />,
    );

    expect(screen.getByText("Friend: יוסי לוי")).toBeInTheDocument();
    expect(screen.getAllByTestId("friend-component")).toHaveLength(1);
  });

  it("displays empty state when no friends", () => {
    render(<FriendList currentUserUid={currentUser.uid} relations={[]} />);

    expect(screen.queryByTestId("friend-component")).not.toBeInTheDocument();
    expect(screen.getByText("אין חברים עדיין")).toBeInTheDocument();
  });

  it("removes friend successfully", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    const removeButtons = screen.getAllByText("Remove Friend");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/set-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ req_uid: "relation-1", status: "rejected" }),
        },
      );
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("ביטלת את החברות בהצלחה");
    });
  });

  it("shows error message when removing friend fails", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    const removeButtons = screen.getAllByText("Remove Friend");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("שגיאה בביטול החברות");
    });
  });

  it("updates local state after removing friend", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    // Initially should have 2 friends
    expect(screen.getAllByTestId("friend-component")).toHaveLength(2);

    const removeButtons = screen.getAllByText("Remove Friend");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      // After removal, should have 1 friend left
      expect(screen.getAllByTestId("friend-component")).toHaveLength(1);
    });
  });

  it("handles network errors when removing friend", async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    const removeButtons = screen.getAllByText("Remove Friend");
    fireEvent.click(removeButtons[0]);

    // Network errors are logged but don't show toast error messages
    // The friend list should still have both friends
    await waitFor(() => {
      expect(screen.getAllByTestId("friend-component")).toHaveLength(2);
    });
  });

  it("maintains correct friend-relation mapping", () => {
    render(
      <FriendList currentUserUid={currentUser.uid} relations={mockRelations} />,
    );

    const friendComponents = screen.getAllByTestId("friend-component");

    // Each friend component should have the remove action
    friendComponents.forEach((component) => {
      expect(component).toHaveTextContent("Action: remove");
    });
  });

  it("handles mixed user positions in relations", () => {
    const mixedRelations: FriendRelation[] = [
      {
        id: "relation-1",
        user1: currentUser,
        user2: friend1,
        status: "accepted",
      },
      {
        id: "relation-2",
        user1: friend2,
        user2: currentUser,
        status: "accepted",
      },
    ];

    render(
      <FriendList
        currentUserUid={currentUser.uid}
        relations={mixedRelations}
      />,
    );

    expect(screen.getByText("Friend: יוסי לוי")).toBeInTheDocument();
    expect(screen.getByText("Friend: מיכל אברהם")).toBeInTheDocument();
    expect(screen.getAllByTestId("friend-component")).toHaveLength(2);
  });
});

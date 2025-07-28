import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import InviteDialog from "@/components/friends/InviteDialog";
import { User } from "@/app/types/User";
import { Group } from "@/app/types/Group";
import { GameType } from "@/app/enums/game-type.enum";
import {
  cleanupAsyncOperations,
  suppressConsoleLogs,
} from "@/__tests__/utils/test-utils";

// Mock the dependencies
jest.mock("@/lib/actions", () => ({
  inviteFriendsToGame: jest.fn(),
  inviteGroupToGame: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { inviteFriendsToGame, inviteGroupToGame } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const mockInviteFriendsToGame = inviteFriendsToGame as jest.MockedFunction<
  typeof inviteFriendsToGame
>;
const mockInviteGroupToGame = inviteGroupToGame as jest.MockedFunction<
  typeof inviteGroupToGame
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockFriends: User[] = [
  {
    uid: "friend-1",
    firstName: "יוסי",
    lastName: "לוי",
    userEmail: "yossi@example.com",
    birthDay: new Date("1992-01-01"),
    role: "user",
    fieldsManage: [],
    gameParticipations: [],
    createdGames: [],
  },
  {
    uid: "friend-2",
    firstName: "מיכל",
    lastName: "אברהם",
    userEmail: "michal@example.com",
    birthDay: new Date("1993-01-01"),
    role: "user",
    fieldsManage: [],
    gameParticipations: [],
    createdGames: [],
  },
  {
    uid: "friend-3", // This friend is already in the game
    firstName: "דני",
    lastName: "כהן",
    userEmail: "danny@example.com",
    birthDay: new Date("1994-01-01"),
    role: "user",
    fieldsManage: [],
    gameParticipations: [],
    createdGames: [],
  },
];

const mockGroups: Group[] = [
  {
    groupId: "group-1",
    groupName: "קבוצת הכדורסל",
    gameTypes: [GameType.BasketBall],
    groupMembers: [],
  },
  {
    groupId: "group-2",
    groupName: "חברי הפארק",
    gameTypes: [GameType.FootBall],
    groupMembers: [],
  },
];

describe("InviteDialog Component", () => {
  const mockRefresh = jest.fn();
  const gameId = "test-game-123";
  const playersInGame = ["friend-3"]; // friend-3 is already in the game

  beforeEach(() => {
    jest.clearAllMocks();
    suppressConsoleLogs();
    mockUseRouter.mockReturnValue({
      refresh: mockRefresh,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  afterEach(async () => {
    await cleanupAsyncOperations();
  });

  it("renders invite dialog trigger button", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    const triggerButton = screen.getByRole("button");
    expect(triggerButton).toBeInTheDocument();
  });

  it("opens dialog when trigger button is clicked", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    expect(screen.getByText("הזמן שחקנים למשחק")).toBeInTheDocument();
  });

  it("displays tabs for friends and groups", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    expect(screen.getByText("חברים")).toBeInTheDocument();
    expect(screen.getByText("קבוצות")).toBeInTheDocument();
  });

  it("filters out friends already in the game", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Should show יוסי and מיכל, but not דני (who is already in the game)
    expect(screen.getByText("יוסי לוי")).toBeInTheDocument();
    expect(screen.getByText("מיכל אברהם")).toBeInTheDocument();
    expect(screen.queryByText("דני כהן")).not.toBeInTheDocument();
  });

  it("allows selecting and deselecting friends", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Find and click checkbox for יוסי
    const checkboxes = screen.getAllByRole("checkbox");
    const yossiCheckbox = checkboxes.find((checkbox) =>
      checkbox.closest("div")?.textContent?.includes("יוסי"),
    );

    expect(yossiCheckbox).toBeInTheDocument();
    fireEvent.click(yossiCheckbox!);

    // Checkbox should be checked
    expect(yossiCheckbox).toBeChecked();
  });

  it("sends friend invitations successfully", async () => {
    mockInviteFriendsToGame.mockResolvedValueOnce({
      ok: true,
      message: "Invitations sent successfully",
    });

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Select a friend
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // Click invite button
    const inviteButton = screen.getByText("הזמן חברים נבחרים");
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(mockInviteFriendsToGame).toHaveBeenCalledWith(gameId, [
        "friend-1",
      ]);
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Invitations sent successfully",
      );
    });
  });

  it("shows error message when friend invitation fails", async () => {
    mockInviteFriendsToGame.mockResolvedValueOnce({
      ok: false,
      message: "Failed to send invitations",
    });

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Select a friend
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // Click invite button
    const inviteButton = screen.getByText("הזמן חברים נבחרים");
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Failed to send invitations",
      );
    });
  });

  it("switches to groups tab and displays groups", async () => {
    const user = userEvent.setup();

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    await user.click(triggerButton);

    // Initially friends tab should be active
    expect(screen.getByText("יוסי לוי")).toBeInTheDocument();

    // Click groups tab using userEvent for better interaction
    const groupsTab = screen.getByRole("tab", { name: "קבוצות" });
    await user.click(groupsTab);

    // Wait for tab to be selected
    await waitFor(() => {
      expect(groupsTab).toHaveAttribute("aria-selected", "true");
    });

    // Look for group content
    await waitFor(() => {
      expect(screen.getByText(/קבוצת הכדורסל/)).toBeInTheDocument();
    });
    expect(screen.getByText(/חברי הפארק/)).toBeInTheDocument();
  });

  it("sends group invitations successfully", async () => {
    const user = userEvent.setup();

    mockInviteGroupToGame.mockResolvedValueOnce({
      ok: true,
      message: "Group invited successfully",
    });

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    await user.click(triggerButton);

    // Switch to groups tab using userEvent
    const groupsTab = screen.getByRole("tab", { name: "קבוצות" });
    await user.click(groupsTab);

    // Wait for tab to be selected
    await waitFor(() => {
      expect(groupsTab).toHaveAttribute("aria-selected", "true");
    });

    // Wait for groups content to load
    await waitFor(() => {
      expect(screen.getByText(/קבוצת הכדורסל/)).toBeInTheDocument();
    });

    // Select a group - trigger the checkbox state change directly
    const groupContainer = screen
      .getByText(/קבוצת הכדורסל/)
      .closest("div")?.parentElement;
    const checkbox = within(groupContainer!).getByRole("checkbox");

    // Instead of clicking checkbox, click the group container to trigger the state change
    await user.click(groupContainer!);

    // Wait for checkbox to be checked
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // Find and click the invite button - wait for it to be enabled
    const inviteButton = await waitFor(() => {
      const button = screen.getByText("הזמן קבוצות נבחרות");
      expect(button).not.toBeDisabled();
      return button;
    });

    await user.click(inviteButton);

    await waitFor(() => {
      expect(mockInviteGroupToGame).toHaveBeenCalledWith(gameId, "group-1");
    });

    expect(mockToast.success).toHaveBeenCalledWith("הקבוצות הוזמנו בהצלחה!");
  });

  it("displays no friends message when all friends are in game", () => {
    const allFriendsInGame = mockFriends.map((friend) => friend.uid);

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={allFriendsInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    expect(screen.getByText("אין חברים זמינים")).toBeInTheDocument();
  });

  it("disables invite button when no selections made", () => {
    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    const inviteButton = screen.getByText("הזמן חברים נבחרים");
    expect(inviteButton).toBeDisabled();
  });

  it("closes dialog after successful invitation", async () => {
    mockInviteFriendsToGame.mockResolvedValueOnce({
      ok: true,
      message: "Success",
    });

    render(
      <InviteDialog
        gameId={gameId}
        friends={mockFriends}
        groups={mockGroups}
        playersInGame={playersInGame}
      />,
    );

    // Open dialog
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);

    // Select friend and send invitation
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    const inviteButton = screen.getByText("הזמן חברים נבחרים");
    fireEvent.click(inviteButton);

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});

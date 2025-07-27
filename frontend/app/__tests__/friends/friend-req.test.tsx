import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FriendReq from "@/components/friends/FriendReq";
import { FriendRelation } from "@/app/types/friend-relation";
import { User } from "@/app/types/User";

const mockUser1: User = {
  uid: "user-1",
  firstName: "יוסי",
  lastName: "לוי",
  userEmail: "yossi@example.com",
  birthDay: new Date("1992-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

const mockUser2: User = {
  uid: "user-2",
  firstName: "מיכל",
  lastName: "אברהם",
  userEmail: "michal@example.com",
  birthDay: new Date("1993-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

const mockFriendRequest: FriendRelation = {
  id: "request-123",
  user1: mockUser1,
  user2: mockUser2,
  status: "pending",
};

describe("FriendReq Component", () => {
  const mockRequestClicked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders friend request information correctly", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    expect(screen.getByText("יש לך בקשת חברות מ:")).toBeInTheDocument();
    expect(screen.getByText("יוסי לוי")).toBeInTheDocument();
  });

  it("displays approve and reject buttons", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    // Check that both buttons are rendered (approve and reject)
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  it("calls requestClicked with approved when approve button is clicked", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const buttons = screen.getAllByRole("button");
    const approveButton = buttons[0]; // First button should be approve (green check)

    fireEvent.click(approveButton);

    expect(mockRequestClicked).toHaveBeenCalledWith("approved");
    expect(mockRequestClicked).toHaveBeenCalledTimes(1);
  });

  it("calls requestClicked with rejected when reject button is clicked", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const buttons = screen.getAllByRole("button");
    const rejectButton = buttons[1]; // Second button should be reject (red X)

    fireEvent.click(rejectButton);

    expect(mockRequestClicked).toHaveBeenCalledWith("rejected");
    expect(mockRequestClicked).toHaveBeenCalledTimes(1);
  });

  it("has proper layout and styling classes", () => {
    const { container } = render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "flex",
      "w-full",
      "items-center",
      "justify-between",
      "py-2",
      "hover:bg-gray-100",
    );
  });

  it("displays friend name with proper styling", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const friendName = screen.getByText("יוסי לוי");
    expect(friendName).toHaveClass("font-semibold");

    const requestText = screen.getByText("יש לך בקשת חברות מ:");
    expect(requestText.parentElement).toHaveClass("text-sm", "text-gray-700");
  });

  it("handles different friend names correctly", () => {
    const differentRequest: FriendRelation = {
      ...mockFriendRequest,
      user1: {
        ...mockUser1,
        firstName: "דני",
        lastName: "כהן",
      },
    };

    render(
      <FriendReq req={differentRequest} requestClicked={mockRequestClicked} />,
    );

    expect(screen.getByText("דני כהן")).toBeInTheDocument();
    expect(screen.getByText("יש לך בקשת חברות מ:")).toBeInTheDocument();
  });

  it("has proper actions container styling", () => {
    const { container } = render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const actionsDiv = container.querySelector(".actions");
    expect(actionsDiv).toHaveClass("flex", "gap-2");
  });

  it("buttons have proper flex centering classes", () => {
    const { container } = render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("flex", "items-center", "justify-center");
    });
  });

  it("renders Hebrew text correctly", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    // Test that Hebrew text is properly rendered
    const hebrewText = screen.getByText("יש לך בקשת חברות מ:");
    expect(hebrewText).toBeInTheDocument();
    expect(hebrewText).toBeVisible();
  });

  it("handles multiple rapid clicks properly", () => {
    render(
      <FriendReq req={mockFriendRequest} requestClicked={mockRequestClicked} />,
    );

    const approveButton = screen.getAllByRole("button")[0];

    // Click multiple times rapidly
    fireEvent.click(approveButton);
    fireEvent.click(approveButton);
    fireEvent.click(approveButton);

    // Should call the function for each click (component doesn't prevent multiple clicks)
    expect(mockRequestClicked).toHaveBeenCalledTimes(3);
    expect(mockRequestClicked).toHaveBeenCalledWith("approved");
  });

  it("maintains component structure with various props", () => {
    const customRequest: FriendRelation = {
      id: "custom-123",
      user1: {
        uid: "custom-user",
        firstName: "אבי",
        lastName: "יוסף",
        userEmail: "avi@example.com",
        birthDay: new Date("1990-01-01"),
        role: "admin",
        fieldsManage: [],
        gameParticipations: [],
        createdGames: [],
      },
      user2: mockUser2,
      status: "pending",
    };

    render(
      <FriendReq req={customRequest} requestClicked={mockRequestClicked} />,
    );

    expect(screen.getByText("אבי יוסף")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});

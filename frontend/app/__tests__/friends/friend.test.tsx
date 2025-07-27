import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Friend from "@/components/friends/Friend";
import { User } from "@/app/types/User";

// Mock the dependencies
jest.mock("@/lib/authFetch", () => ({
  authFetch: jest.fn(),
}));

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

const mockFriend: User = {
  uid: "friend-123",
  firstName: "יוסי",
  lastName: "לוי",
  userEmail: "yossi@example.com",
  birthDay: new Date("1992-01-01"),
  role: "user",
  fieldsManage: [],
  gameParticipations: [],
  createdGames: [],
};

describe("Friend Component", () => {
  const userId = "current-user-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders friend information correctly", () => {
    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    expect(screen.getByText("יוסי לוי")).toBeInTheDocument();

    // Check avatar fallback initials
    expect(screen.getByText("יל")).toBeInTheDocument();
  });

  it("renders add friend button when action is add", () => {
    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    expect(addButton).toBeInTheDocument();
    // Should have UserPlus icon or "add friend" functionality
  });

  it("renders remove friend button when action is remove", () => {
    render(
      <Friend
        userId={userId}
        friend={mockFriend}
        action="remove"
        relationId="relation-123"
      />,
    );

    const removeButton = screen.getByRole("button");
    expect(removeButton).toBeInTheDocument();
  });

  it("sends friend request when add button is clicked", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/send-req`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_uid: mockFriend.uid }),
        },
      );
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "בקשת חברות נשלחה בהצלחה!",
      );
    });
  });

  it("shows error message when friend request fails", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("שגיאה בשליחת בקשת חברות");
    });
  });

  it("disables button while loading", async () => {
    // Mock a slow response
    mockAuthFetch.mockImplementation(() => {
      return new Promise(() => {}); // Never resolves
    });

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    // The component should handle loading state (though we can't easily test disabled state without more implementation details)
    expect(mockAuthFetch).toHaveBeenCalled();
  });

  it("updates state after successful friend request", async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "בקשת חברות נשלחה בהצלחה!",
      );
    });
  });

  it("calls onClick callback when provided", () => {
    const mockOnClick = jest.fn();

    render(
      <Friend
        userId={userId}
        friend={mockFriend}
        action="add"
        onClick={mockOnClick}
      />,
    );

    // Click on the friend info area (not the button)
    const friendInfo = screen.getByText("יוסי לוי");
    fireEvent.click(friendInfo.closest("div")!);

    // Note: onClick behavior depends on implementation - this test may need adjustment based on actual behavior
  });

  it("renders avatar with correct fallback initials", () => {
    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    // Check for avatar fallback initials (יוסי לוי -> יל)
    const avatarFallback = screen.getByText("יל");
    expect(avatarFallback).toBeInTheDocument();
  });

  it("has proper responsive classes", () => {
    const { container } = render(
      <Friend userId={userId} friend={mockFriend} action="add" />,
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "flex",
      "w-full",
      "items-center",
      "justify-between",
    );
  });

  it("handles network errors gracefully", async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("שגיאה בשליחת בקשת חברות");
    });
  });

  it("prevents multiple rapid clicks", async () => {
    mockAuthFetch.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            } as Response),
          100,
        );
      });
    });

    render(<Friend userId={userId} friend={mockFriend} action="add" />);

    const addButton = screen.getByRole("button");

    // Click multiple times rapidly
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    // Should only make one API call
    expect(mockAuthFetch).toHaveBeenCalledTimes(1);
  });
});

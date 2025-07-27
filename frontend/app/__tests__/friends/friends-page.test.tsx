import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FriendsPage from "@/app/friends/page";

// Mock the dependencies
jest.mock("@/lib/authFetch", () => ({
  authFetch: jest.fn(),
}));

jest.mock("@/lib/session", () => ({
  getSession: jest.fn(),
}));

jest.mock("@/components/friends/FriendList", () => {
  return function MockFriendList({ currentUserUid, relations }: any) {
    return (
      <div data-testid="friend-list">
        <div>Current User: {currentUserUid}</div>
        <div>Relations Count: {relations.length}</div>
      </div>
    );
  };
});

jest.mock("@/components/friends/Friend", () => {
  return function MockFriend({ friend, action, userId }: any) {
    return (
      <div data-testid="friend-component">
        <div>
          Friend: {friend.firstName} {friend.lastName}
        </div>
        <div>Action: {action}</div>
        <div>User ID: {userId}</div>
      </div>
    );
  };
});

jest.mock("next/form", () => {
  return function MockForm({ children, action }: any) {
    return <form action={action}>{children}</form>;
  };
});

import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { Role } from "@/app/enums/role.enum";

const mockAuthFetch = authFetch as jest.MockedFunction<typeof authFetch>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

const mockUser = {
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

const mockFriends = [
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
];

const mockFriendRelations = [
  {
    id: "relation-1",
    user1: mockUser,
    user2: mockFriends[0],
    status: "accepted" as const,
  },
];

describe("Friends Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetSession.mockResolvedValue({
      user: {
        uid: "current-user-123",
        name: "דני כהן",
        role: Role.USER,
      },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    });

    // Mock friend search API call
    mockAuthFetch.mockImplementation((url: string | URL) => {
      const urlString = url.toString();
      if (urlString.includes("/users/search_friends/")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockFriends),
        } as Response);
      }

      if (urlString.includes("/friends/getAll")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockFriendRelations),
        } as Response);
      }

      return Promise.resolve({
        json: () => Promise.resolve([]),
      } as Response);
    });
  });

  it("renders the friends page with header", async () => {
    const searchParams = Promise.resolve({});
    const page = await FriendsPage({ searchParams });

    render(page);

    expect(screen.getByText("חברים")).toBeInTheDocument();
    expect(
      screen.getByText("נהל את החברים שלך וחפש חברים חדשים"),
    ).toBeInTheDocument();
  });

  it("displays friends list section", async () => {
    const searchParams = Promise.resolve({});
    const page = await FriendsPage({ searchParams });

    render(page);

    expect(screen.getByText("רשימת החברים")).toBeInTheDocument();
    expect(screen.getByTestId("friend-list")).toBeInTheDocument();
    expect(
      screen.getByText("Current User: current-user-123"),
    ).toBeInTheDocument();
    expect(screen.getByText("Relations Count: 1")).toBeInTheDocument();
  });

  it("displays search form", async () => {
    const searchParams = Promise.resolve({});
    const page = await FriendsPage({ searchParams });

    render(page);

    const searchInput = screen.getByPlaceholderText("הקלד שם");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("name", "query");

    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeInTheDocument();
  });

  it("displays search results when query exists", async () => {
    const searchParams = Promise.resolve({ query: "יוסי" });
    const page = await FriendsPage({ searchParams });

    render(page);

    expect(screen.getByText("תוצאות החיפוש")).toBeInTheDocument();
    expect(screen.getAllByTestId("friend-component")).toHaveLength(2);
    expect(screen.getByText("Friend: יוסי לוי")).toBeInTheDocument();
    expect(screen.getByText("Friend: מיכל אברהם")).toBeInTheDocument();
    expect(screen.getAllByText("Action: add")).toHaveLength(2);
  });

  it("displays no results message when search returns empty", async () => {
    const searchParams = Promise.resolve({ query: "אין כזה" });

    // Mock empty search results
    mockAuthFetch.mockImplementation((url: string | URL) => {
      const urlString = url.toString();
      if (urlString.includes("/users/search_friends/")) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
        } as Response);
      }

      if (urlString.includes("/friends/getAll")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockFriendRelations),
        } as Response);
      }

      return Promise.resolve({
        json: () => Promise.resolve([]),
      } as Response);
    });

    const page = await FriendsPage({ searchParams });

    render(page);

    expect(screen.getByText("לא נמצאו תוצאות")).toBeInTheDocument();
    expect(
      screen.getByText('לא נמצאו חברים התואמים לחיפוש "אין כזה"'),
    ).toBeInTheDocument();
  });

  it("displays initial search prompt when no query", async () => {
    const searchParams = Promise.resolve({});
    const page = await FriendsPage({ searchParams });

    render(page);

    expect(screen.getByText("תוצאות החיפוש")).toBeInTheDocument();
  });

  it("calls correct API endpoints", async () => {
    const searchParams = Promise.resolve({ query: "test" });
    await FriendsPage({ searchParams });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search_friends/test`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(mockAuthFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
    );
  });

  it("has proper responsive layout classes", async () => {
    const searchParams = Promise.resolve({});
    const page = await FriendsPage({ searchParams });

    const { container } = render(page);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("min-h-screen", "p-2", "sm:p-4");

    const innerDiv = mainDiv.firstChild as HTMLElement;
    expect(innerDiv).toHaveClass(
      "mx-auto",
      "max-w-md",
      "space-y-4",
      "px-2",
      "sm:max-w-2xl",
      "sm:space-y-6",
      "sm:px-0",
    );
  });
});

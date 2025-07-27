import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@/app/auth/login/page";

// Mock the auth components
jest.mock("@/components/auth/loginForm", () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form Mock</div>;
  };
});

jest.mock("@/components/auth/authWrapper", () => {
  return function MockAuthWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-wrapper">{children}</div>;
  };
});

describe("Login Page", () => {
  it("renders login page with correct Hebrew text", () => {
    render(<Login />);

    // Check if the main heading text is rendered
    expect(screen.getByText("נראה שאתה עדיין לא מחובר,")).toBeInTheDocument();
    expect(screen.getByText("אז איך נכניס אותך למגרש?")).toBeInTheDocument();
  });

  it("renders login form component", () => {
    render(<Login />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders auth wrapper component", () => {
    render(<Login />);

    expect(screen.getByTestId("auth-wrapper")).toBeInTheDocument();
  });

  it("renders signup link with correct text", () => {
    render(<Login />);

    expect(screen.getByText("עדיין לא נרשמת?")).toBeInTheDocument();
    expect(screen.getByText("בתור שחקן")).toBeInTheDocument();

    const signupLink = screen.getByRole("link", { name: "בתור שחקן" });
    expect(signupLink).toHaveAttribute("href", "/auth/signup");
  });

  it("renders field manager contact link", () => {
    render(<Login />);

    expect(screen.getByText("או")).toBeInTheDocument();
    expect(screen.getByText("כמנהל מגרש")).toBeInTheDocument();

    const managerLink = screen.getByRole("link", { name: "כמנהל מגרש" });
    expect(managerLink).toHaveAttribute("href", "/contact");
  });

  it("has proper link styling", () => {
    render(<Login />);

    const loginLink = screen.getByRole("link", { name: "כמנהל מגרש" });
    expect(loginLink).toHaveClass("text-title", "font-medium", "underline");
  });
});

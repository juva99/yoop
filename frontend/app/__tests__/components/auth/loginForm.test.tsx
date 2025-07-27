import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock the login function before importing the component
const mockLogin = jest.fn();
jest.mock("@/lib/auth", () => ({
  login: mockLogin,
}));

// Now import the component
import LoginForm from "@/components/auth/loginForm";

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(<LoginForm />);

    // Check for email field
    expect(screen.getByLabelText("אימייל")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com"),
    ).toBeInTheDocument();

    // Check for password field
    expect(screen.getByLabelText("סיסמא")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole("button", { name: "התחבר" })).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    render(<LoginForm />);

    const forgotLink = screen.getByRole("link", { name: "שכחת סיסמה?" });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/auth/forgot");
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("••••••••");

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find and click the toggle button
    const toggleButton = passwordInput.parentElement?.querySelector(
      'button[type="button"]',
    );
    expect(toggleButton).toBeInTheDocument();

    if (toggleButton) {
      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      // Click to hide password again
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  it("displays validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: "התחבר" });

    // Try to submit without filling fields
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("חובה למלא אימייל")).toBeInTheDocument();
      expect(screen.getByText("לפחות 8 תווים")).toBeInTheDocument();
    });
  });

  it("displays validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const submitButton = screen.getByRole("button", { name: "התחבר" });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("אימייל לא תקין")).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = screen.getByRole("button", { name: "התחבר" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "StrongPass123!");
    await user.click(submitButton);

    // Button should show loading text
    await waitFor(() => {
      expect(screen.getByText("מתחבר...")).toBeInTheDocument();
    });
  });
});

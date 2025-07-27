import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Custom render function that includes common providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, options);

export * from "@testing-library/react";
export { customRender as render };

// Common test data for forms
export const mockFormData = {
  validLogin: {
    userEmail: "test@example.com",
    pass: "StrongPass123!",
  },
  validSignup: {
    firstName: "ישראל",
    lastName: "ישראלי",
    userEmail: "test@example.com",
    pass: "StrongPass123!",
    passConfirm: "StrongPass123!",
    phoneNum: "0501234567",
    birthDay: "1990-01-01",
    address: "jerusalem",
  },
  invalidLogin: {
    userEmail: "invalid-email",
    pass: "weak",
  },
  invalidSignup: {
    firstName: "John", // Non-Hebrew
    lastName: "Doe", // Non-Hebrew
    userEmail: "invalid-email",
    pass: "weak",
    passConfirm: "different",
    phoneNum: "123456789",
    birthDay: "",
    address: "",
  },
};

// Helper function to wait for form validation
export const waitForFormValidation = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Helper to create mock functions
export const createMockFunction = () => jest.fn();

// Common assertions
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveClass = (
  element: HTMLElement | null,
  ...classes: string[]
) => {
  expect(element).toHaveClass(...classes);
};

export const expectToHaveAttribute = (
  element: HTMLElement | null,
  attr: string,
  value?: string,
) => {
  if (value) {
    expect(element).toHaveAttribute(attr, value);
  } else {
    expect(element).toHaveAttribute(attr);
  }
};

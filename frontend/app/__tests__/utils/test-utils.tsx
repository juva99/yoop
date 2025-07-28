import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { act } from "@testing-library/react";

// Custom render function that includes common providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, options);

export * from "@testing-library/react";
export { customRender as render };

// Helper function to wait for async operations to complete
export const waitForAsyncOperations = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

// Helper function to ensure all promises are settled
export const waitForAllPromises = async () => {
  await act(async () => {
    // Wait multiple cycles to ensure all nested promises complete
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });
};

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

// Helper for cleanup after async operations
export const cleanupAsyncOperations = async () => {
  await act(async () => {
    // Wait for multiple event loop cycles to ensure all async operations complete
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });
};

// Helper to suppress console logs during tests
export const suppressConsoleLogs = () => {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
  
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog;
  };
};

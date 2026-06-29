import { test as base, expect } from "@playwright/test";

export { expect };

// Extend basic test with custom fixtures if needed
export const test = base.extend({});

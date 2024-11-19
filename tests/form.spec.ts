import { test, expect } from '@playwright/test';

test.describe('Dynamic Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173'); // URL where the form is rendered
  });

  test('should render the form with all fields', async ({ page }) => {
    // Verify the form title and description
    await expect(page.locator('h1')).toHaveText('Dynamic Form'); // Assuming this is the title
    await expect(page.locator('p.description')).toContainText('Please fill out the details below.'); // Assuming description class

    // Check that all fields are rendered
    const fields = [
      { type: 'input[type="text"]', label: 'Name' },
      { type: 'input[type="email"]', label: 'Email' },
      { type: 'textarea', label: 'Message' },
      { type: 'input[type="file"]', label: 'Upload File' },
      { type: 'select', label: 'Options' },
      { type: 'input[type="checkbox"]', label: 'Terms' },
      { type: 'input[type="radio"]', label: 'Gender' },
      { type: 'input[type="date"]', label: 'Date of Birth' },
      { type: 'input[type="number"]', label: 'Age' },
    ];

    for (const field of fields) {
      await expect(page.locator(field.type)).toBeVisible();
    }
  });

  test('should enforce required field validations', async ({ page }) => {
    // Click submit without entering data
    await page.click('button[type="submit"]');

    // Check for validation errors
    const errorMessages = await page.locator('.error-message').allTextContents();
    expect(errorMessages).toContain('This field is required');
  });

  test('should validate specific field constraints', async ({ page }) => {
    // Fill invalid data
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="number"]', '999999999999999999999');

    // Attempt to submit
    await page.click('button[type="submit"]');

    // Verify validation errors
    const emailError = await page.locator('input[type="email"] + .error-message').textContent();
    const numberError = await page.locator('input[type="number"] + .error-message').textContent();

    expect(emailError).toBe('Please enter a valid email address.');
    expect(numberError).toBe('Value exceeds the maximum allowed.');
  });

  test('should submit valid form data successfully', async ({ page }) => {
    // Fill valid data
    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', 'johndoe@example.com');
    await page.fill('textarea', 'Hello, this is a test message.');
    await page.setInputFiles('input[type="file"]', 'path/to/file.txt');
    await page.selectOption('select', { value: 'option1' });
    await page.check('input[type="checkbox"]');
    await page.check('input[type="radio"][value="male"]');
    await page.fill('input[type="date"]', '2000-01-01');
    await page.fill('input[type="number"]', '25');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success
    const successMessage = await page.locator('.success-message').textContent();
    expect(successMessage).toBe('Form submitted successfully!');
  });

  test('should reset the form when reset button is clicked', async ({ page }) => {
    // Fill some fields
    await page.fill('input[type="text"]', 'Sample');
    await page.fill('input[type="email"]', 'sample@example.com');

    // Click reset button
    await page.click('button[type="reset"]');

    // Verify that fields are cleared
    const textFieldValue = await page.inputValue('input[type="text"]');
    const emailFieldValue = await page.inputValue('input[type="email"]');

    expect(textFieldValue).toBe('');
    expect(emailFieldValue).toBe('');
  });
});

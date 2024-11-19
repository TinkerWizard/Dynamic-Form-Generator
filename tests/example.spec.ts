import { test, expect} from '@playwright/test';

test.describe("Home Page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173");

    });
    test("Should have correct metadata and elements", async ({page}) => {
        await expect(page).toHaveTitle("Dynamic Form Generator");
        await expect(
            page.getByRole("heading", {
                name: "JSON Editor",
            })
        ).toBeVisible();
        await expect(
            page.getByRole("paragraph", {
                name:"Read Only",
            })
        ).toBeHidden();

    });

    test("Should alter the Form Preview section", async({ page }) => {
        await page.getByLabel("Editor").inputValue();

        await expect(
            page.getByRole("paragraph", {
                name: "Copy Code",
            })
        ).toBeVisible();

    });

    test("Editor should be empty at the beginning", async ({ page }) => {
        // Wait for editor to be visible
        const editor = await page.getByTestId("editor");
        await editor.waitFor({ state: 'visible' });
        
        // Wait for loading state to disappear if present
        const loadingElement = page.getByText('Loading editor...');
        await loadingElement.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
            // Ignore if loading element wasn't shown
        });
        
        // Get editor content
        const editorContent = await page.evaluate(() => {
            const editorInstance = window.monaco.editor.getModels()[0];
            return editorInstance?.getValue() ?? '';
        });
        
        expect(editorContent).toBe('');
    });
});
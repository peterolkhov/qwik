import { expect, test } from '@playwright/test';

const cases = [
  { name: 'control native named click', button: 'native-open', scope: 'open', request: false },
  { name: 'control native named requestSubmit', button: 'native-open', scope: 'open', request: true },
  { name: 'bug enhanced named click', button: 'enhanced-open', scope: 'open', request: false },
  { name: 'bug enhanced named requestSubmit', button: 'enhanced-open', scope: 'open', request: true },
  { name: 'control enhanced unnamed click', button: 'enhanced-all', scope: '', request: false },
  { name: 'control enhanced hidden scope', button: 'hidden-open', scope: 'open', request: false },
];

for (const fixture of cases) {
  test(fixture.name, async ({ page }) => {
    await page.goto('http://localhost:3301/qwikrouter-test/ui50-get-submit/');
    await expect(page.locator('h1')).toHaveText('Report search');
    await page.waitForFunction(() => Boolean((window as any)._qwikEv?.roots));
    const button = page.locator('#' + fixture.button);
    if (fixture.request) {
      await button.evaluate((node: HTMLButtonElement) => node.form!.requestSubmit(node));
    } else {
      await button.click();
    }
    await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('release');
    await expect(page.locator('#shown')).toContainText('q=release;scope=');
    await expect(page.locator('#navigating')).toHaveText('false');
    const url = new URL(page.url());
    const actual = {
      q: url.searchParams.get('q'),
      scope: url.searchParams.get('scope') ?? '',
      tags: url.searchParams.getAll('tag'),
      shown: await page.locator('#shown').textContent(),
      reports: await page.locator('#reports li').allTextContents(),
    };
    console.log('UI50_NATIVE_OUTPUT ' + JSON.stringify({ name: fixture.name, actual }));
    expect(actual).toEqual({
      q: 'release',
      scope: fixture.scope,
      tags: ['a', 'b'],
      shown: `q=release;scope=${fixture.scope}`,
      reports: fixture.scope === 'open' ? ['Release checklist'] : ['Release checklist', 'Archived release notes'],
    });
  });
}

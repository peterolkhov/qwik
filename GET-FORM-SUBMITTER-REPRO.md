# GET Form submitter reproduction

This branch contains only diagnostic files; framework source is unchanged from QwikDev/qwik d7ec29baab92f77c552322603724f7b960b11e5a.

The two readable fixtures below are exactly the bytes exercised by [the native run](https://github.com/peterolkhov/qwik/actions/runs/43149010499). The workflow installs those files into a fresh whole-project upstream checkout and checks tracked-source and fixture hashes before and after execution. Its successful diagnostic result means the expected two failing assertions and four passing controls were observed, not that the bug is fixed.

## Reproduce

Clone this fork branch, then copy `.github/workflows/get-form-repro-route.tsx` to `e2e/qwik-e2e/apps/qwikrouter-test/src/routes/ui50-get-submit/index.tsx` (create its route directory), and `.github/workflows/get-form-repro.e2e.ts` to `e2e/qwik-e2e/tests/qwikrouter/ui50-get-submit.e2e.ts`.

Use Node24.15.0 and pnpm11.22.0. From repository root run:

```sh
pnpm install --frozen-lockfile
pnpm dlx @intellectronica/ruler@0.3.42 apply --no-gitignore --no-mcp
pnpm build.core.dev
pnpm exec playwright install --with-deps chromium
pnpm exec playwright test e2e/qwik-e2e/tests/qwikrouter/ui50-get-submit.e2e.ts --browser=chromium --config e2e/qwik-e2e/playwright.config.ts --workers=1 --retries=0 --timeout=180000 --reporter=line
```

The Playwright configuration starts the actual project server. Wait for the Qwik loader before interacting; the fixture does so. Clicking the enhanced named button or calling `requestSubmit(button)` loses `scope=open`; the route loader consequently renders both reports instead of only the open report. Native form click/requestSubmit, unnamed enhanced submit and hidden-input scope are passing controls. The repeated tag values remain intact.

The self-contained workflow at `.github/workflows/codex-get-submitter-before.yml` also provides an exact automated reproduction without the manual copy steps. No external service or account is used by the fixture. Report and fixture prepared with Codex; no human hardware or application-use claim is made.

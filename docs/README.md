# MovieHub FE Documentation

Use this index to find the right project notes quickly. These docs describe the current `docs/` folder and the active Next.js frontend; deleted or archived root-level audit files are intentionally not listed here.

## Start Here

| Document                                    | Purpose                                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Project overview](./project-overview.md)   | High-level app identity, stack, routes, commands, configuration, and deployment notes.                                                |
| [Architecture](./architecture.md)           | Data flow, HTTP client behavior, query conventions, SSR hydration, auth/session flow, video playback, realtime, and SEO architecture. |
| [Development guide](./development-guide.md) | Local workflow, environment rules, feature/page patterns, styling conventions, video workflows, and common pitfalls.                  |

## Conventions And Workflows

| Document                                                        | Purpose                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Export style conventions](./export-style.md)                   | Canonical export style by file category.                                    |
| [Skeleton loading audit plan](./skeleton-loading-audit-plan.md) | Checklist and workflow for verifying skeleton loaders against real layouts. |

## Reviews And Audit Reports

| Document                                                                            | Purpose                                                              |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Component decomposition review](./component-decomposition-review.md)               | Current status of broad component decomposition work across the app. |
| [Component split analysis: `src/components/app`](./component-split-analysis-app.md) | Current split/refactor candidates for shared app components.         |
| [Responsive UI audit](./responsive-ui-audit.md)                                     | Static responsive layout findings and recommended fixes.             |
| [Security best practices report](./security-best-practices-report.md)               | Static security review findings and recommended remediation work.    |

## Root-Level References

| Document               | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| [README](../README.md) | Main project entry point, features, setup, scripts, conventions, and CI/CD notes. |
| [AGENTS](../AGENTS.md) | Primary agent instructions for this repository.                                   |
| [CLAUDE](../CLAUDE.md) | Claude Code-specific working context.                                             |
| [GEMINI](../GEMINI.md) | Gemini CLI-specific working context.                                              |

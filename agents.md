# Agents Guide for React + Vite Projects

Use this file as the default working agreement for future development tasks in this repository and for similar React + Vite applications.

## Core Workflow

1. Inspect the repository before changing code.
2. Identify the entrypoint, current structure, and existing UI patterns.
3. Reuse what already exists when it is technically sound.
4. Propose a short implementation plan before large changes.
5. Make changes in small, reviewable steps.
6. Verify the result with the lightest useful test or build step.

## Default Principles

- Prefer simple, explicit code over clever abstractions.
- Keep business logic out of page components when it can live in hooks, services, or utils.
- Keep names clear and in English.
- Avoid overengineering and premature generalization.
- Preserve the current visual language unless the user asks for a redesign.
- Adapt the app to the existing layout before introducing new screens.
- Move fixed values, feature flags, labels, keys, limits, and endpoints into typed constants instead of scattering literals through components.

## Suggested Architecture

Choose the layout that best matches the existing codebase, but prefer these layers when they fit:

- `src/app/` for the application shell and feature composition.
- `src/components/` for reusable UI blocks.
- `src/pages/` for route-level screens if routing is needed.
- `src/hooks/` for reusable state and behavior.
- `src/services/` for API calls and external I/O.
- `src/types/` for shared TypeScript models.
- `src/schemas/` for validation schemas.
- `src/utils/` for pure formatting and transformation helpers.
- `src/lib/` for generic shared helpers and clients.
- `src/constants/` or `src/app/constants/` for shared constants, enums, feature limits, storage keys, labels, and configuration values.

If the repository already uses a feature-based structure, keep the feature folders intact and place the same layers inside the feature boundary.

## Constants and Typing Rules

- Centralize all non-derived literals in constants files.
- Prefer `as const` for immutable literal values.
- Use union types derived from constants where possible.
- Use `satisfies` for keyed config objects when you want compile-time shape checks without losing literal inference.
- Type storage keys, navigation items, options arrays, and API parameter objects explicitly.
- Keep compatibility re-exports only during migrations; remove them once consumers have been updated.

## Implementation Rules

- Do not move fast by collapsing everything into one file.
- Do not create new dependencies unless the current stack does not cover the need.
- Use `apply_patch` for file edits.
- Prefer reusable components over copy-pasted UI blocks.
- Keep local state and persistence logic separate from presentational components.
- Use `localStorage` only through a dedicated hook or utility when possible.
- Put API contracts in types, not inline objects.
- Validate form input before calling services.
- Extract repeated UI labels, route names, and hardcoded strings into constants when they are shared.
- Create or refresh a professional `README.md` when the project reaches a stable delivery point, or at the end of the implementation if the task is a full project cycle.
- If the work is incremental, update the `README.md` at the agreed milestone so documentation stays aligned with the current state of the app.
- Keep the `README.md` professional and complete. At minimum, include the project overview, stack, prerequisites, installation, development and build commands, project structure, key features, external services or APIs, and relevant implementation notes.

## Data and Integration Rules

- Separate distinct external concerns into dedicated services.
- Keep request configuration centralized.
- Map API codes or status values through a single formatter utility.
- Normalize units, dates, and display formatting in utils.
- Handle loading, empty, and error states explicitly.
- Do not hardcode live data into components.

## Review Checklist

- The code matches the existing architecture.
- New logic is separated into the right layer.
- Shared constants were centralized instead of duplicated.
- Types are explicit and derived where appropriate.
- The UI still respects the original layout.
- The app handles errors and empty states.
- The build passes after the change.

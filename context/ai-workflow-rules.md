# Development Workflow

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.

## When To Split Work

Split an implementation step if it combines:

- UI changes and background task changes
- Real-time canvas state and database persistence
- Multiple unrelated API routes
- Behavior that is not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:

- `components/ui/*` (shadcn/ui components)
- third-party library internals

These should remain default and reusable.

Project-specific styling, layout changes, and feature logic must be implemented in app-level components instead of modifying foundation components.

Only modify these files when a task explicitly requires it.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries
- Storage model decisions
- Code conventions or standards
- Feature scope

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `progress-tracker.md` reflects the completed work.


## Strict Feature Scope Enforcement

1. The requested feature specification is the implementation boundary for the current task.
2. Implement only the components, behaviors, and supporting changes explicitly required by that specification.
3. Changes to shared integration points, such as `app/layout.tsx`, are permitted only when necessary to integrate the requested feature. Do not add unrelated content or redesign existing pages.
4. Never build, redesign, populate, or expand the homepage merely to demonstrate a newly implemented component.
5. Preserve existing pages and functionality unless the feature specification explicitly requires changes to them.
6. Before editing any file, determine why the change is necessary for the requested feature. If it is not necessary, do not make it.
7. If an essential requirement cannot be implemented without expanding scope, stop and ask for clarification instead of making assumptions.
8. After implementation, inspect the changed files and verify that every change belongs to the requested feature. Revert unrelated changes introduced during the task.
9. Report the exact files changed, the reason for each change, the checks performed, and any incomplete work. Never claim success without verification.
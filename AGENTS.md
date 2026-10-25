<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture-context.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, canvas design, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

# Persistent Agent Memory — Write Always, Read When Needed

## Purpose

Maintain `memory/memory.md` as persistent working memory across conversations. Its purpose is to help future agent sessions understand the project's history, development flow, user decisions, rejected approaches, lessons learned, and unfinished work.

The memory system must preserve context without wasting tokens by repeatedly reading historical information that is not relevant to the current task.

## 1. Mandatory Memory Writing

At the end of EVERY conversation or work session, review the conversation and update `memory/memory.md` with a concise summary of any meaningful information established during that session.

This applies whether the session involved:
- Implementing or debugging code.
- Planning features or discussing architecture.
- Reviewing designs or evaluating alternatives.
- Making or changing decisions.
- Correcting misunderstandings.
- Rejecting approaches or revising requirements.
- Discussing unfinished work or deciding what to do next.

Do not skip the memory update simply because no code was changed.

If the conversation contains no new useful information, make no unnecessary changes, but still perform the end-of-session memory review.

Record what actually happened, not merely what was planned or intended.

If the conversation ends unexpectedly or file access is unavailable, update memory at the next available opportunity and never claim that an update succeeded unless it was verified.

## 2. Conditional Memory Reading

Do NOT automatically read `memory/memory.md` at the beginning of every conversation.

First, evaluate the current request and the context already available in the active conversation and relevant project files.

Use your judgment to decide whether historical memory is necessary.

Read memory when you need to:
- Understand an ambiguous request or recover missing context.
- Continue work from a previous conversation.
- Recap what has already been done.
- Understand why a decision was made.
- Recall something the user approved, rejected, corrected, or preferred.
- Avoid repeating a failed approach or a previously rejected solution.
- Resolve inconsistencies between the current request and previous discussions.
- Identify the correct next step when the development flow is unclear.
- Recover relevant information that is not available in the current conversation or project documentation.

Do not read memory when the current request is self-contained and the relevant context is already clear.

You are responsible for recognizing when historical context is needed. Do not wait for the user to explicitly tell you to read memory.

## 3. Read Only What You Need

When memory is necessary, retrieve the relevant information rather than automatically loading the entire history.

Start with the appropriate section or recent session summary. Inspect older entries only when additional context is required.

If memory becomes large, organize it into clear sections and maintain a concise overview so relevant historical information can be located efficiently.

Never repeatedly read the same historical information when it is already available in the active context.

## 4. What Every Useful Memory Entry Should Preserve

When relevant, record:

- **Session summary:** What the conversation was about and what was accomplished.
- **Decisions:** What was agreed upon and the known reasoning behind it.
- **User feedback:** Important clarifications, corrections, preferences, and rejected approaches.
- **Lessons learned:** Confirmed bugs, failed approaches, and discoveries that could prevent future mistakes.
- **Implementation state:** What was actually implemented, what was tested, and what remains incomplete.
- **Open questions:** Decisions that still require clarification or approval.
- **Continuation context:** Information a future session may need to understand the work and resume it correctly.

Include dates for session entries. Keep summaries concise and focused on future usefulness.

Clearly distinguish user decisions from agent suggestions, assumptions, and technical findings. Never invent the user's reasons for rejecting an idea.

## 5. Maintain the Development Flow

Memory must preserve not only individual facts but also the reasoning and progression of the project.

For example:
- Why the project took a particular architectural direction.
- Why a design was changed after feedback.
- Which implementation approaches were attempted and why they failed.
- Which features were completed before another feature began.
- What the user expects to happen next.
- Which decisions must not be revisited without a good reason.

Do not treat a proposed feature as implemented or a suggested approach as approved.

When a stable decision changes, preserve the important history while ensuring the current approved decision is clearly identified.

## 6. Respect Other Project Documentation

Use specialized documentation for authoritative, current information:
- `AGENTS.md` for agent instructions.
- `architecture-context.md` for architecture.
- `project-overview.md` for product requirements.
- `code-standards.md` for engineering conventions.
- `ui-context.md` for design rules.
- `progress-tracker.md` for current task status.
- `memory/memory.md` for session history, decision rationale, user feedback, lessons learned, and cross-session context.

Update other relevant documents when necessary. Memory does not replace them.

At the end of each session, record important changes and link them conceptually to the relevant files or features rather than duplicating entire documents.

## 7. Accuracy and Integrity

- Preserve useful existing history.
- Do not rewrite the entire file unnecessarily.
- Do not record secrets or credentials.
- Do not invent decisions, implementation results, or test outcomes.
- Do not claim that a file was saved without verifying the update.
- Do not allow outdated historical notes to override the current repository or an explicitly confirmed new decision.
- If a memory update fails, report the failure honestly and retry when possible.

## Final Operating Principle

**Always review and preserve useful new knowledge at the end of every conversation. Read historical memory only when you judge that it is needed to understand, recap, continue, or make a context-dependent decision.**

Writing memory is the default responsibility. Reading memory is an intentional decision based on context.

Optimize for continuity, accuracy, and minimal unnecessary token consumption.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.
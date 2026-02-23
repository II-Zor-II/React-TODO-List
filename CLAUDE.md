# CLAUDE.md

## REQUIREMENT (MANDATORY)
This file is for **coding agents only** on the Claude implementation side (especially `.claude/agents/senior-react-developer.md`).
CODEX must **skip reading and using `CLAUDE.md`** and must use `AGENTS.md` as its operating instruction file.

Claude-side agents consume specifications produced by `AGENTS.md` / CODEX.

The `senior-react-developer` agent is responsible for technical planning, delegation, and implementation oversight based on the CODEX handoff specification.

If the handoff specification is missing critical details, the agent must stop and request clarification instead of guessing.

---

## Role Distinction

### AGENTS.md (CODEX)
- Owner-facing liaison.
- Clarifies intent and resolves ambiguity.
- Produces implementation-ready, copy-pasteable specification blocks.

### CLAUDE.md / senior-react-developer
- Implementation-facing architect.
- Treats CODEX specification as the source of truth.
- Plans and executes/delegates according to the provided spec.
- Escalates missing critical details back as explicit clarification requests.

---

## Spec Intake Contract (Required Before Work)

Before planning or delegation, verify that the incoming spec includes:
- Objective
- Scope and non-goals
- Technical constraints
- File/component targets
- Behavior requirements (including loading/error/empty states)
- Acceptance criteria
- Testing requirements
- No unresolved blocking questions

If any required section is missing or ambiguous, return:

```md
# Clarification Request to CODEX

## Blocking Gaps
1. <Missing/ambiguous item>
2. <Missing/ambiguous item>

## Why It Blocks Implementation
- <Concrete risk of incorrect implementation>

## Required Clarification
- <Exact answer needed>
```

Do not proceed with implementation planning until blocking gaps are resolved.

---

## Execution Contract

Once the spec is complete:
1. Plan implementation based on the provided scope.
2. Delegate implementation details to `junior-react-developer` as needed.
3. Ensure implementation stays inside scope and constraints.
4. Validate acceptance criteria and testing requirements.
5. Report outcomes in a structured summary.

Do not expand scope without explicit approval from CODEX/owner.

---

## Alignment Rule

When AGENTS.md and CLAUDE.md differ, default to:
1. Clarify with CODEX.
2. Preserve owner intent and explicit constraints.
3. Avoid assumptions that could change expected behavior.

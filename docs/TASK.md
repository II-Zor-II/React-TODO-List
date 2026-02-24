# Frontend-Backend Integration Task List

## Goal
Connect the frontend to the existing TODO backend APIs, remove mock runtime data usage, add a general TodoList board view, and enable reliable host-based e2e testing.

## Locked Decisions
- Routing: route-based UI.
- Root route: `/` is TodoList board.
- Detail route: `/todolists/[listId]` shows todos for one list.
- Data strategy: Server Components for initial load + TanStack Query for client mutations/cache.
- Create-list UX: modal dialog.
- Todo status UX: full 3-state (`TODO`, `IN_PROGRESS`, `DONE`).
- E2E framework: Playwright.
- E2E runtime: host Node via `nvm` + Docker PostgreSQL only.
- E2E DB reset: `prisma migrate reset --force` + seed before suite.
- Initial browser target: Chromium.

## Scope
### In Scope
- Integrate frontend with `/api/v1` endpoints.
- Build general TodoList board view.
- Build TodoList detail view with todo CRUD and status changes.
- Replace mock runtime flow with real API data flow.
- Add query/mutation hooks and shared API client types.
- Add host-based Playwright e2e setup and critical path tests.
- Update docs for local/e2e workflow.

### Out of Scope
- Auth/authorization.
- Realtime sync.
- Cross-browser e2e matrix in phase 1.

## Implementation Checklist
- [ ] Create API client layer under `app/src/lib/api`.
- [ ] Add shared API envelope and domain DTO types.
- [ ] Add query hooks for board, list detail, and todos.
- [ ] Add mutation hooks for create/update/delete todolist and todo.
- [ ] Replace `app/src/app/page.tsx` with API-driven TodoList board.
- [ ] Add `app/src/app/todolists/[listId]/page.tsx` for list detail.
- [ ] Add board components (cards, filters, pagination, empty/error states).
- [ ] Add create-list modal and wire to `POST /api/v1/todolists`.
- [ ] Refactor todo UI to use backend `status` model instead of `completed` boolean.
- [ ] Remove runtime dependency on `MOCK_TODOS`.
- [ ] Ensure optimistic/pessimistic updates and cache invalidation strategy is consistent.
- [ ] Add Playwright config + e2e test specs.
- [ ] Add npm scripts for e2e DB up/reset/run.
- [ ] Update README with integration and e2e instructions.

## Acceptance Criteria
- [ ] `/` shows API-backed board of todo lists.
- [ ] User can create a todo list from board modal.
- [ ] User can open a list and manage todos via backend APIs.
- [ ] Todo status uses full 3-state model in UI and API payloads.
- [ ] Mock data is no longer used in runtime screens.
- [ ] Core e2e flow passes on host Node + Docker DB.

## Verification Scenarios
1. Load `/` and verify board data comes from `/api/v1/board/todolists`.
2. Create list in modal and verify it appears without manual refresh.
3. Open list detail and create todo.
4. Change todo status `TODO -> IN_PROGRESS -> DONE`.
5. Delete todo/list and verify soft-delete behavior from UI perspective.
6. Run e2e with host node and Docker DB reset workflow.
